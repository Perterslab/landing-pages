"use client";

import { useState, useEffect } from "react";
import { supabaseBrowserClient } from "@utils/supabase/client";

export default function PureLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("等待输入...");

  // 1. 进入页面时，暴力清除所有可能导致框架误判的本地缓存
  useEffect(() => {
    supabaseBrowserClient.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    setStatus("缓存已清空，系统就绪");
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("正在验证...");
    
    const { error } = await supabaseBrowserClient.auth.signInWithPassword({ email, password });
    
    if (!error) {
      setStatus("登录成功！正在跳转...");
      // 2. 登录成功后，使用最原生的浏览器跳转，绝不使用框架路由
      window.location.href = "/admin/products"; 
    } else {
      setStatus("登录失败: " + error.message);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a', color: 'white', fontFamily: 'system-ui' }}>
        <form onSubmit={handleLogin} style={{ padding: '40px', backgroundColor: '#1e293b', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '20px', width: '380px', border: '1px solid #334155', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <h2 style={{ textAlign: 'center', color: '#3b82f6', marginBottom: '10px', fontSize: '1.5rem', fontWeight: 'bold' }}>Ray's Lab (原生通道)</h2>
            
            <input 
              placeholder="管理员邮箱" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              style={{ padding: '14px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: 'white', outline: 'none' }} 
            />
            <input 
              type="password" 
              placeholder="密码" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              style={{ padding: '14px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: 'white', outline: 'none' }} 
            />
            
            <button type="submit" style={{ padding: '14px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '10px' }}>
              直接登入
            </button>
            
            <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8', marginTop: '10px' }}>
              当前状态: {status}
            </div>
        </form>
    </div>
  );
}