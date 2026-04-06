'use client';

import { useEffect, useRef, useState } from 'react';

export default function AiGirl() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [anamClient, setAnamClient] = useState<any>(null);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('Загрузка...');

  useEffect(() => {
    let client: any = null;

    const init = async () => {
      try {
        setStatus('Получаем токен от сервера...');

        const res = await fetch('/api/session-token', { 
          method: 'POST',
          cache: 'no-store' 
        });
        
        if (!res.ok) throw new Error('Не удалось получить токен');

        const data = await res.json();

        if (!data.sessionToken) {
          throw new Error(data.error || 'Session token не получен');
        }

        setStatus('Подключаем реалистичный аватар...');

        // Динамический импорт — решает проблему сборки с esm.sh
        const { createClient, AnamEvent } = await import('https://esm.sh/@anam-ai/js-sdk@latest');

        client = createClient(data.sessionToken, {
          disableInputAudio: false,
        });

        if (videoRef.current) {
          await client.streamToVideoElement(videoRef.current);
        }

        // Слушаем ответы от девушки
        client.addListener(AnamEvent.MESSAGE_STREAM_EVENT_RECEIVED, (event: any) => {
          if (event.role === 'persona' && event.content) {
            setMessages(prev => [...prev, { sender: 'AI', text: event.content }]);
          }
        });

        setAnamClient(client);
        setStatus('✅ Готово! Пиши Анне или говори в микрофон');
      } catch (err: any) {
        console.error('Ошибка инициализации:', err);
        setStatus('❌ Ошибка: ' + (err.message || 'Проверь API ключ в Vercel'));
      }
    };

    init();

    // Очистка при размонтировании
    return () => {
      if (client?.disconnect) client.disconnect();
    };
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || !anamClient) return;

    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    const text = input.trim();
    setInput('');

    try {
      await anamClient.talk(text);
    } catch (err) {
      console.error('Ошибка отправки:', err);
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      background: '#0a0a0a', 
      color: '#fff', 
      fontFamily: 'system-ui, sans-serif' 
    }}>
      {/* Видео аватар */}
      <div style={{ flex: 1, position: 'relative', background: '#000' }}>
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        <div style={{ 
          position: 'absolute', 
          top: 15, 
          left: 15, 
          background: 'rgba(0,0,0,0.75)', 
          padding: '10px 14px', 
          borderRadius: '10px',
          fontSize: '15px'
        }}>
          {status}
        </div>
      </div>

      {/* Чат */}
      <div style={{ 
        height: '340px', 
        overflowY: 'auto', 
        padding: '16px', 
        background: '#111', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px' 
      }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#888', marginTop: '40px' }}>
            Напиши первое сообщение Анне...
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              background: msg.sender === 'user' ? '#0d6efd' : '#2a2a2a',
              padding: '13px 17px',
              borderRadius: '18px',
              maxWidth: '82%',
              borderBottomRightRadius: msg.sender === 'user' ? '4px' : '18px',
              borderBottomLeftRadius: msg.sender === 'user' ? '18px' : '4px',
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
            placeholder="Напиши Анне что-нибудь..."
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
