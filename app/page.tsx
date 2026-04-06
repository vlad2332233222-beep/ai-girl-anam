'use client';

import { useEffect, useRef, useState } from 'react';

export default function AiGirl() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [anamClient, setAnamClient] = useState<any>(null);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('Загрузка...');

  useEffect(() => {
    const initAvatar = async () => {
      try {
        setStatus('Получаем session token...');

        const res = await fetch('/api/session-token', { method: 'POST' });
        const data = await res.json();

        if (!data.sessionToken) {
          throw new Error(data.error || 'Не удалось получить токен');
        }

        setStatus('Подключаем аватар...');

        // Прямой импорт (с next.config.mjs должно работать)
        const { createClient, AnamEvent } = await import('https://esm.sh/@anam-ai/js-sdk@latest');

        const client = createClient(data.sessionToken, {
          disableInputAudio: false,
        });

        if (videoRef.current) {
          await client.streamToVideoElement(videoRef.current);
        }

        client.addListener(AnamEvent.MESSAGE_STREAM_EVENT_RECEIVED, (event: any) => {
          if (event.role === 'persona' && event.content) {
            setMessages((prev) => [...prev, { sender: 'AI', text: event.content }]);
          }
        });

        setAnamClient(client);
        setStatus('✅ Готово! Пиши Анне');
      } catch (err: any) {
        console.error(err);
        setStatus('❌ Ошибка: ' + (err.message || 'Проверь API ключ'));
      }
    };

    initAvatar();
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || !anamClient) return;

    setMessages((prev) => [...prev, { sender: 'user', text: input }]);
    const text = input.trim();
    setInput('');

    try {
      await anamClient.talk(text);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0a0a0a', color: '#fff', fontFamily: 'system-ui' }}>
      <div style={{ flex: 1, position: 'relative', background: '#000' }}>
        <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: 15, left: 15, background: 'rgba(0,0,0,0.8)', padding: '10px 16px', borderRadius: '10px' }}>
          {status}
        </div>
      </div>

      <div style={{ height: '340px', overflowY: 'auto', padding: '16px', background: '#111', display: 'flex', flexDirection: 'column', gap: '12px' }}>
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

      <div style={{ padding: '14px', background: '#111', borderTop: '1px solid #333' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Напиши Анне..."
            style={{ flex: 1, padding: '16px 20px', borderRadius: '9999px', border: 'none', background: '#222', color: '#fff' }}
          />
          <button onClick={sendMessage} style={{ padding: '0 32px', borderRadius: '9999px', background: '#0d6efd', color: 'white', border: 'none' }}>
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
}
