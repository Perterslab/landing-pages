"use client";

import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, Button, Card, Space, Divider } from "antd";
import { PlusOutlined, DeleteOutlined, UpOutlined, DownOutlined } from "@ant-design/icons";

export default function ProductCreate() {
  // useForm 会自动接管保存到 Supabase 的所有逻辑
  const { formProps, saveButtonProps } = useForm({});
  
  // 核心魔法 1：实时监听产品类型，决定下方渲染什么界面
  const productType = Form.useWatch("product_type", formProps.form);

  return (
    <Edit saveButtonProps={saveButtonProps} title="发布新软件 / 插件">
      <Form {...formProps} layout="vertical" initialValues={{ product_type: "standard" }}>
        
        {/* ================= 1. 基础通用字段 ================= */}
        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="软件名称" name="name" rules={[{ required: true }]}>
            <Input placeholder="例如：PriceWatch Asia" />
          </Form.Item>
          <Form.Item label="URL 访问路径 (Slug)" name="slug" rules={[{ required: true }]} tooltip="决定了前台的网址，必须是英文和连字符，不能重复">
            <Input placeholder="例如：pricewatch-asia" />
          </Form.Item>
        </div>

        <Form.Item label="一句话简介" name="tagline">
          <Input placeholder="例如：东南亚电商竞品监控利器" />
        </Form.Item>

        {/* ================= 2. 类型切换中枢 ================= */}
        <Form.Item label="落地页展示类型" name="product_type" rules={[{ required: true }]}>
          <Select
            options={[
              { value: "standard", label: "🎯 标准型 (基础图文 + 简单下载)" },
              { value: "complex", label: "🚀 项目型 (高级多模块 + 动态积木)" },
            ]}
          />
        </Form.Item>

        <Divider />

        {/* ================= 3. 分支 A：标准型配置 ================= */}
        {productType === "standard" && (
          <div className="bg-white p-4 border rounded">
            <Form.Item label="详细描述" name="description">
              <Input.TextArea rows={4} placeholder="输入软件详细介绍..." />
            </Form.Item>
            <Form.Item label="下载链接" name="download_link">
              <Input placeholder="https://chrome.google.com/webstore/..." />
            </Form.Item>
          </div>
        )}

        {/* ================= 4. 分支 B：项目型动态积木 ================= */}
        {productType === "complex" && (
          <Card title="🧩 页面积木配置" size="small" className="bg-gray-50 border-blue-200">
            {/* Form.List 是处理 JSON 数组的神器 */}
            <Form.List name="page_blocks">
              {(fields, { add, remove, move }) => (
                <div className="flex flex-col gap-4">
                  {fields.map(({ key, name, ...restField }, index) => (
                    <Card key={key} size="small" className="shadow-sm">
                      {/* 模块头部与排序控制 */}
                      <div className="flex justify-between items-center mb-4 pb-2 border-b">
                        <span className="font-bold text-gray-600">排版模块 #{index + 1}</span>
                        <Space>
                          <Button size="small" icon={<UpOutlined />} onClick={() => move(index, index - 1)} disabled={index === 0} />
                          <Button size="small" icon={<DownOutlined />} onClick={() => move(index, index + 1)} disabled={index === fields.length - 1} />
                          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                        </Space>
                      </div>

                      <Form.Item {...restField} name={[name, "type"]} label="选择本块的展现形式">
                        <Select
                          options={[
                            { value: "hero", label: "大标题横幅 (Hero)" },
                            { value: "feature_grid", label: "功能矩阵网络 (Feature Grid)" },
                          ]}
                        />
                      </Form.Item>

                      {/* 核心魔法 2：根据选择的模块类型，动态展现不同的输入框 */}
                      <Form.Item noStyle shouldUpdate>
                        {() => {
                          const type = formProps.form?.getFieldValue(["page_blocks", name, "type"]);
                          
                          if (type === "hero") {
                            return (
                              <Form.Item {...restField} name={[name, "data", "title"]} label="输入大标题内容">
                                <Input placeholder="例如：激发你的创作潜能" />
                              </Form.Item>
                            );
                          }
                          
                          if (type === "feature_grid") {
                            return (
                              <Form.Item {...restField} name={[name, "data", "items"]} label="输入功能点 (输入文字后按回车键)">
                                {/* tags 模式会自动把用户的输入变成 ["A", "B"] 的数组格式，直接适配 Supabase JSON */}
                                <Select mode="tags" style={{ width: '100%' }} placeholder="例如输入: AI一键剪辑 (按回车)" />
                              </Form.Item>
                            );
                          }
                          return null;
                        }}
                      </Form.Item>
                    </Card>
                  ))}
                  
                  {/* 添加新模块的触发器 */}
                  <Button 
                    type="dashed" 
                    onClick={() => add({ id: Date.now().toString(), type: 'hero', data: {} })} 
                    block 
                    icon={<PlusOutlined />}
                    className="border-blue-300 text-blue-600"
                  >
                    添加新排版模块
                  </Button>
                </div>
              )}
            </Form.List>
          </Card>
        )}
      </Form>
    </Edit>
  );
}
