"use client";

import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select, Switch, Card, Button, Space, Typography, Divider } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function ProductCreate() {
  const { formProps, saveButtonProps } = useForm({});
  
  // 监听产品类型，实现表单的动态变形
  const productType = Form.useWatch("product_type", formProps.form);

  return (
    <Create saveButtonProps={saveButtonProps} title={<Title level={3}>🚀 发布新数字资产</Title>}>
      <Form 
        {...formProps} 
        layout="vertical"
        initialValues={{
          product_type: "standard",
          is_published: false,
          content: { features: [] } // 初始化 JSONB 结构
        }}
      >
        <Card title="基础信息 (必填)" bordered={false} style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", gap: "16px" }}>
            <Form.Item
              label="产品名称"
              name="name"
              rules={[{ required: true, message: "请输入产品名称" }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="例如：PriceWatch Asia" size="large" />
            </Form.Item>

            <Form.Item
              label="URL 访问路径 (Slug)"
              name="slug"
              rules={[{ required: true, message: "请输入唯一的路径" }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="例如：pricewatch-asia (建议纯小写英文加横杠)" size="large" />
            </Form.Item>
          </div>

          <Form.Item label="一句话简介" name="summary">
            <Input placeholder="用于列表页和 SEO 描述..." />
          </Form.Item>
        </Card>

        <Card title="展示与状态控制" bordered={false} style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
            <Form.Item 
              label="落地页展示类型" 
              name="product_type" 
              style={{ flex: 1, marginBottom: 0 }}
            >
              <Select size="large">
                <Select.Option value="standard">📄 标准型 (基础图文 + 简单下载)</Select.Option>
                <Select.Option value="project">🧱 项目型 (启用高级动态积木模块)</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item 
              label="是否立即发布上线？" 
              name="is_published" 
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Switch checkedChildren="已发布" unCheckedChildren="草稿" />
            </Form.Item>
          </div>
        </Card>

        {/* 条件渲染：只有标准型才显示简单的下载链接和描述 */}
        {productType === "standard" && (
          <Card title="标准型内容" bordered={false} style={{ marginBottom: 16 }}>
            <Form.Item label="下载链接或访问地址" name="download_url">
              <Input placeholder="https://..." size="large" />
            </Form.Item>
            <Form.Item label="详细描述" name="description">
              <TextArea rows={6} placeholder="输入软件详细介绍（支持普通文本或基础 HTML）..." />
            </Form.Item>
          </Card>
        )}

        {/* 条件渲染：积木系统大显身手的地方 (数据存入 content 字段) */}
        {productType === "project" && (
          <Card title="🧱 动态积木配置 (Project 专属)" bordered={false} style={{ marginBottom: 16 }}>
            <Text type="secondary">在这里添加的内容将以 JSON 格式存储，并在前台被渲染成精美的独立站模块。</Text>
            <Divider />
            
            <Form.List name={["content", "features"]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 16 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'title']}
                        rules={[{ required: true, message: '缺少模块标题' }]}
                      >
                        <Input placeholder="特性标题 (如: 极速响应)" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'description']}
                        rules={[{ required: true, message: '缺少模块描述' }]}
                      >
                        <Input.TextArea placeholder="特性详细描述..." rows={1} style={{ width: '400px' }} />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} style={{ color: 'red' }} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      新增特性区块 (Feature Block)
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Card>
        )}
      </Form>
    </Create>
  );
}