'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { io, Socket } from 'socket.io-client'
import Editor from '@monaco-editor/react'
import { Video, VideoOff, MessageSquare, Terminal, Copy } from 'lucide-react'

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'

interface SessionWorkspaceProps {
  sessionId: string
  sessionTitle: string
}

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  text: string
  timestamp: Date
  isSystem?: boolean
}

export default function SessionWorkspace({ sessionId, sessionTitle }: SessionWorkspaceProps) {
  const [socket, setSocket] = useState<Socket | null>(null)
  
  // Code Editor State
  const [code, setCode] = useState('// Write your code here')
  const [language, setLanguage] = useState('javascript')
  const editorRef = useRef<any>(null)
  const isUpdatingRef = useRef<boolean>(false) // Prevent infinite loop
  const codeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: 'sys-1', senderId: 'system', senderName: 'System', text: `Welcome to ${sessionTitle}.`, timestamp: new Date(), isSystem: true
  }])
  const [chatInput, setChatInput] = useState('')
  const chatMessagesEndRef = useRef<HTMLDivElement>(null)

  // WebRTC & Video State
  const [isVideoEnabled, setIsVideoEnabled] = useState(false)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)

  // Current User Context
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    let newSocket: Socket | null = null;
    
    async function initWorkspace() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) return;
      setCurrentUser(session.user)

      newSocket = io(NEXT_PUBLIC_BACKEND_URL, {
        auth: { token: session.access_token }
      })

      newSocket.on('connect', () => {
        newSocket?.emit('join-room', sessionId)
      })

      // -- Editor Sync --
      newSocket.on('code-change', (newCode: string) => {
        isUpdatingRef.current = true
        setCode(newCode)
      })

      // -- Chat Sync --
      newSocket.on('chat-message', (data: any) => {
        setMessages(prev => [...prev, {
          id: Math.random().toString(),
          senderId: data.senderId,
          senderName: data.senderName,
          text: data.message,
          timestamp: new Date(data.timestamp)
        }])
      })

      // -- Disconnect Edge Case --
      newSocket.on('peer-disconnected', (userId) => {
        setMessages(prev => [...prev, {
          id: Math.random().toString(), senderId: 'system', senderName: 'System', 
          text: 'Peer disconnected or left the session.', timestamp: new Date(), isSystem: true
        }])
        
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null
        if (peerConnectionRef.current) {
          peerConnectionRef.current.close()
          peerConnectionRef.current = null
        }
      })

      // -- WebRTC Signaling --
      newSocket.on('webrtc-offer', async (offer) => {
        if (!peerConnectionRef.current) initPeerConnection(newSocket!)
        await peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(offer))
        const answer = await peerConnectionRef.current?.createAnswer()
        await peerConnectionRef.current?.setLocalDescription(answer)
        newSocket!.emit('webrtc-answer', { roomId: sessionId, answer })
      })

      newSocket.on('webrtc-answer', async (answer) => {
        await peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(answer))
      })

      newSocket.on('webrtc-ice-candidate', async (candidate) => {
        try {
          await peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(candidate))
        } catch (e) {
          console.error('Error adding ICE candidate', e)
        }
      })

      setSocket(newSocket)
    }

    initWorkspace()

    return () => {
      newSocket?.disconnect()
      localStreamRef.current?.getTracks().forEach(track => track.stop())
      peerConnectionRef.current?.close()
      if (codeTimeoutRef.current) clearTimeout(codeTimeoutRef.current)
    }
  }, [sessionId])

  // Scroll to bottom of chat
  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // --- WebRTC Logic ---
  const initPeerConnection = (activeSocket: Socket) => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    })

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        activeSocket.emit('webrtc-ice-candidate', { roomId: sessionId, candidate: event.candidate })
      }
    }

    peer.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0]
      }
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        peer.addTrack(track, localStreamRef.current!)
      })
    }

    peerConnectionRef.current = peer
  }

  const toggleVideo = async () => {
    if (isVideoEnabled) {
      // Turn off
      localStreamRef.current?.getTracks().forEach(track => track.stop())
      if (localVideoRef.current) localVideoRef.current.srcObject = null
      peerConnectionRef.current?.close()
      peerConnectionRef.current = null
      setIsVideoEnabled(false)
    } else {
      // Turn on
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        localStreamRef.current = stream
        if (localVideoRef.current) localVideoRef.current.srcObject = stream
        setIsVideoEnabled(true)

        if (!peerConnectionRef.current && socket) {
          initPeerConnection(socket)
        }
        
        const offer = await peerConnectionRef.current?.createOffer()
        await peerConnectionRef.current?.setLocalDescription(offer)
        socket?.emit('webrtc-offer', { roomId: sessionId, offer })
      } catch (err) {
        console.error('Error accessing media devices.', err)
        alert('Could not access camera/microphone.')
      }
    }
  }

  // --- Throttled Editor Mutator ---
  const handleEditorChange = (value: string | undefined) => {
    if (isUpdatingRef.current) {
      // It's a remote update, so just unlock it and return
      isUpdatingRef.current = false
      return
    }

    const newVal = value || ''
    setCode(newVal)
    
    if (codeTimeoutRef.current) clearTimeout(codeTimeoutRef.current)
    
    codeTimeoutRef.current = setTimeout(() => {
      if (socket) {
        socket.emit('code-change', { roomId: sessionId, code: newVal })
      }
    }, 500)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim() || !socket || !currentUser) return

    const newMsg = {
      id: Math.random().toString(),
      senderId: currentUser.id,
      senderName: currentUser.user_metadata.full_name || 'Anonymous',
      text: chatInput,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMsg])
    
    socket.emit('chat-message', {
      roomId: sessionId,
      message: chatInput,
      senderId: newMsg.senderId,
      senderName: newMsg.senderName
    })

    const supabase = createClient()
    supabase.from('messages').insert([{
       session_id: sessionId,
       sender_id: newMsg.senderId,
       content: chatInput
    }]).then(({error}) => {
       if(error) console.error("Failed to save message to DB", error)
    })

    setChatInput('')
  }

  return (
    <main className="flex flex-1 overflow-hidden">
      <div className="flex flex-1 flex-col border-r border-gray-200 bg-[#1e1e1e] dark:border-zinc-800">
        <div className="flex h-10 items-center justify-between bg-[#2d2d2d] px-4 text-xs font-medium text-gray-300">
          <div className="flex gap-4 items-center">
            <span className="flex items-center gap-2"><Terminal className="h-3 w-3" /></span>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-[#3d3d3d] border-none text-xs rounded px-2 py-1 outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
            </select>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-500">
            <span>Room: {sessionId.split('-')[0]}</span>
            <button 
              onClick={() => navigator.clipboard.writeText(sessionId)}
              className="hover:text-white transition"
              title="Copy Session ID"
            >
              <Copy className="h-3 w-3" />
            </button>
          </div>
        </div>
        
        <div className="flex-1">
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
            onMount={(ed) => { editorRef.current = ed }}
            options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: 'on', padding: { top: 16 } }}
          />
        </div>
      </div>

      <aside className="w-80 flex-shrink-0 flex flex-col bg-white dark:bg-zinc-900 overflow-hidden">
        <div className="h-72 border-b border-gray-200 bg-black relative dark:border-zinc-800 overflow-hidden flex flex-col items-center justify-center">
          <div className="absolute top-2 right-2 z-10">
            <button 
              onClick={toggleVideo}
              className={`p-2 rounded-full shadow transition ${isVideoEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-600 hover:bg-indigo-500'} text-white`}
            >
              {isVideoEnabled ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
            </button>
          </div>

          <div className="w-full h-full flex flex-col relative">
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
            {!isVideoEnabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/90 text-zinc-500 text-sm font-medium">
                Click above to join Video
              </div>
            )}
            <video ref={localVideoRef} autoPlay playsInline muted className="absolute bottom-2 left-2 w-24 h-32 bg-gray-800 rounded shadow-lg object-cover border-2 border-zinc-800" />
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-gray-200 dark:border-zinc-800 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-indigo-500" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-100">Live Chat</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-zinc-950/20">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col gap-1 ${msg.senderId === currentUser?.id ? 'items-end' : 'items-start'}`}>
                {!msg.isSystem && (
                  <span className="text-[10px] font-medium text-gray-500">{msg.senderName}</span>
                )}
                <div className={`px-3 py-2 text-sm shadow-sm border ${
                  msg.isSystem 
                    ? 'rounded-lg bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 w-full text-center text-xs' 
                    : msg.senderId === currentUser?.id
                      ? 'rounded-l-lg rounded-tr-lg bg-indigo-600 text-white border-transparent'
                      : 'rounded-r-lg rounded-tl-lg bg-white text-gray-900 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatMessagesEndRef} />
          </div>
          
          <div className="p-3 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input 
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message..." 
                className="flex-1 rounded-md border-0 bg-gray-50 px-3 py-2 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-zinc-950 dark:text-zinc-100 dark:ring-zinc-800"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="shrink-0 rounded-md bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </aside>
    </main>
  )
}
