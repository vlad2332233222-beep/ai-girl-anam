'use client';

import { useState } from 'react';

export default function AiGirl() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('AI-Девушка готова');

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');

    // Симуляция ответа (потом заменим на реальный чат)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        sender: 'AI', 
        text: `Привет! Я Анна 😊 Ты написал: "${userMessage}". Что ещё хочешь обсудить?` 
      }]);
    }, 700);
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
      {/* Верхняя часть — аватар (пока фото, потом заменим на видео) */}
      <div style={{ flex: 1, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '280px', 
            height: '280px', 
            background: 'linear-gradient(135deg, #ff9a9e, #fad0c4)', 
            borderRadius: '50%', 
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '100px'
          }}>
            👩‍🦰
          </div>
          <h2>Анна — твоя AI-девушка</h2>
          <p style={{ color: '#aaa' }}>Реалистичная анимация скоро будет подключена</p>
        </div>

        <div style={{ 
          position: 'absolute', 
          top: 20, 
          left: 20, 
          background: 'rgba(0,0,0,0.7)', 
          padding: '10px 16px', 
          borderRadius: '10px' 
        }}>
          {status}
        </div>
      </div>

      {/* Чат */}
      <div style={{ 
        height: '380px', 
        overflowY: 'auto', 
        padding: '20px', 
        background: '#111', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px' 
      }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#777', marginTop: '60px' }}>
            Напиши первое сообщение Анне...
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              background: msg.sender === 'user' ? '#0d6efd' : '#2d2d2d',
              padding: '14px 18px',
              borderRadius: '18px',
              maxWidth: '78%',
              borderBottomRightRadius: msg.sender === 'user' ? '4px' : '18px',
              borderBottomLeftRadius: msg.sender === 'user' ? '18px' : '4px',
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Поле ввода */}
      <div style={{ padding: '16px', background: '#111', borderTop: '1px solid #333' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Напиши Анне..."
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
              padding: '0 36px', 
              borderRadius: '9999px', 
              background: '#0d6efd', 
              border: 'none', 
              color: 'white', 
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
}
