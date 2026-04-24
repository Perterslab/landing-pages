"use client";
import React, { useState } from "react";
import { supabaseBrowserClient } from "@utils/supabase/client";

export default function ImageUpload({ onUploadSuccess, label = "上传图片" }: { onUploadSuccess: (url: string) => void, label?: string }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) return;
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 使用你已经建好的 images 存储桶
      const { error: uploadError } = await supabaseBrowserClient.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 获取公开链接并返回给父组件
      const { data } = supabaseBrowserClient.storage.from('images').getPublicUrl(filePath);
      onUploadSuccess(data.publicUrl);
      
    } catch (error: any) {
      alert("上传失败: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: "inline-block" }}>
      <label style={{ display: "inline-block", padding: "8px 12px", background: "#10b981", color: "#fff", borderRadius: "4px", cursor: "pointer", fontSize: "0.9rem", border: "none", margin: 0 }}>
        {uploading ? "⏳ 上传中..." : `📁 ${label}`}
        <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} style={{ display: "none" }} />
      </label>
    </div>
  );
}