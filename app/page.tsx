'use client';

import { useState } from 'react';

export default function AiGirl() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('Загрузка аватара...');

  // ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
  // Замени на свой реальный embed URL из Anam Lab
  const embedUrl = "https://lab.anam.ai/embed/YOUR_PERSONA_ID_HERE"; 
  // ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text: input.trim() }]);

    // Пока простой ответ (позже можно подключить реальный чат через API)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        sender: 'AI', 
        text: 'Привет! Я Анна. Рада тебя видеть 😊 Что хочешь сегодня поговорить?' 
      }]);
    }, 1000);

    setInput('');
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      background: '#0a0a0a', 
      color: '#fff', 
      fontFamily: 'system-ui, sans-serif',
      overflow: 'hidden'
    }}>
      {/* Аватар через iframe */}
      <div style={{ flex: 1, position: 'relative', background: '#000' }}>
        <iframe 
          src={embedUrl}
          style={{ width: '100%', height: '100%', border: 'none' }}
          allow="camera; microphone; autoplay; clipboard-write"
          title="AI Girl Anna"
        />
        <div style={{ 
          position: 'absolute', 
          top: 15, 
          left: 15, 
          background: 'rgba(0,0,0,0.75)', 
          padding: '10px 16px', 
          borderRadius: '10px',
          zIndex: 10
        }}>
          {status}
        </div>
      </div>

      {/* Чат снизу */}
      <div style={{ 
        height: '340px', 
        overflowY: 'auto', 
        padding: '16px', 
        background: '#111', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px' 
      }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              background: msg.sender === 'user' ? '#0d6efd' : '#333',
              padding: '13px 17px',
              borderRadius: '18px',
              maxWidth: '80%',
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Поле ввода */}
      <div style={{ padding: '14px', background: '#111', borderTop: '1px solid #333' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Напиши сообщение Анне..."
            style={{ 
              flex: 1, 
              padding: '16px 20px', 
              borderRadius: '9999px', 
              border: 'none', 
              background: '#222', 
              color: '#fff', 
              fontSize: '16px' 
            }}
          />
          <button 
            onClick={sendMessage}
            style={{ 
              padding: '0 32px', 
              borderRadius: '9999px', 
              background: '#0d6efd', 
              border: 'none', 
              color: 'white', 
              fontWeight: '600' 
            }}
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
}
