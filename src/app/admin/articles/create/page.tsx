{/* 在第 63 行左右，修改编辑区 div 的部分 */}
<FormGroup label="正文内容 (富文本编辑)">
  <div style={{ border: "1px solid #334155", borderRadius: "8px", overflow: "hidden" }}>
    {/* 工具栏 */}
    <div style={{ padding: "10px", background: "#0f172a", borderBottom: "1px solid #334155", display: "flex", gap: "5px" }}>
      <button onClick={() => handleFormat('bold')} style={btnStyle}><b>B</b></button>
      <button onClick={() => handleFormat('italic')} style={btnStyle}><i>I</i></button>
      <button onClick={() => handleFormat('formatBlock', 'H2')} style={btnStyle}>大标题</button>
      <button onClick={() => handleFormat('formatBlock', 'H3')} style={btnStyle}>小标题</button>
      <button onClick={() => handleFormat('insertUnorderedList')} style={btnStyle}>• 列表</button>
    </div>

    {/* 注入一小段 CSS 来实现 placeholder 效果 */}
    <style>{`
      .editor:empty:before {
        content: attr(data-placeholder);
        color: #64748b;
        cursor: text;
      }
    `}</style>

    {/* 编辑区：修复了 placeholder 导致的类型错误 */}
    <div 
      ref={editorRef}
      contentEditable 
      className="editor"
      data-placeholder="在这里开始写下你的想法..."
      style={{ 
        minHeight: "400px", 
        padding: "20px", 
        background: "#1e293b", 
        outline: "none", 
        lineHeight: "1.8", 
        fontSize: "1.1rem" 
      }}
    />
  </div>
</FormGroup>