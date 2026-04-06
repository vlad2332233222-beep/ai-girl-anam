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
        setStatus('Получаем токен...');

        const res = await fetch('/api/session-token', { method: 'POST' });
        const data = await res.json();

        if (!data.sessionToken) {
          throw new Error(data.error || 'Нет session token');
        }

        setStatus('Подключаем аватар...');

        // Динамический импорт, чтобы избежать проблем на этапе build
        const { createClient, AnamEvent } = await import('https://esm.sh/@anam-ai/js-sdk@latest');

        client = createClient(data.sessionToken, {
          disableInputAudio: false,
        });

        if (videoRef.current) {
          await client.streamToVideoElement(videoRef.current);
        }

        client.addListener(AnamEvent.MESSAGE_STREAM_EVENT_RECEIVED, (event: any) => {
          if (event.role === 'persona' && event.content) {
            setMessages(prev => [...prev, { sender: 'AI', text: event.content }]);
          }
        });

        setAnamClient(client);
        setStatus('Готово! Пиши Анне');
      } catch (err: any) {
        console.error(err);
        setStatus('Ошибка: ' + (err.message || 'Неизвестная ошибка'));
      }
    };

    init();

    return () => {
      if (client) client.disconnect?.();
    };
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || !anamClient) return;

    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    const text = input;
    setInput('');

    try {
      await anamClient.talk(text);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0a0a0a', color: '#fff', fontFamily: 'system-ui' }}>
      <div style={{ flex: 1, position: 'relative', background: '#000' }}>
        <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.7)', padding: '8px 12px', borderRadius: '8px' }}>
          {status}
        </div>
      </div>

      <div style={{ height: '320px', overflowY: 'auto', padding: '15px', background: '#111', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              background: msg.sender === 'user' ? '#0d6efd' : '#333',
              padding: '12px 16px',
              borderRadius: '18px',
              maxWidth: '80%',
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div style={{ padding: '12px', background: '#111', borderTop: '1px solid #333' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Напиши сообщение Анне..."
            style={{ flex: 1, padding: '14px 18px', borderRadius: '9999px', border: 'none', background: '#222', color: '#fff', fontSize: '16px' }}
          />
          <button 
            onClick={sendMessage} 
            style={{ padding: '0 28px', borderRadius: '9999px', background: '#0d6efd', border: 'none', color: 'white', fontWeight: 'bold' }}
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
}
