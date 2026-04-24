"use client";

import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, Switch, Card, Button, Space, Typography, Divider, Spin } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function ProductEdit() {
  const { formProps, saveButtonProps, queryResult } = useForm({
    // 启用自动重定向，编辑成功后跳回列表
    action: "edit",
  });

  const productData = queryResult?.data?.data;
  const loading = queryResult?.isLoading;

  // 监听产品类型变化
  const productType = Form.useWatch("product_type", formProps.form);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" tip="正在加载资产数据..." />
      </div>
    );
  }

  return (
    <Edit saveButtonProps={saveButtonProps} title={<Title level={3}>🛠️ 编辑数字资产：{productData?.name}</Title>}>
      <Form
        {...formProps}
        layout="vertical"
        initialValues={{
          ...productData,
          // 确保内容字段即使在数据库为 null 时也有初始值
          content: productData?.content || { features: [] },
        }}
      >
        <Card title="基础信息" bordered={false} style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", gap: "16px" }}>
            <Form.Item
              label="产品名称"
              name="name"
              rules={[{ required: true, message: "请输入产品名称" }]}
              style={{ flex: 1 }}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              label="URL 访问路径 (Slug)"
              name="slug"
              rules={[{ required: true, message: "Slug 不能为空" }]}
              style={{ flex: 1 }}
              extra="修改 Slug 会导致旧的落地页链接失效，请谨慎操作。"
            >
              <Input size="large" />
            </Form.Item>
          </div>

          <Form.Item label="一句话简介" name="summary">
            <Input />
          </Form.Item>
        </Card>

        <Card title="展示与状态" bordered={false} style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
            <Form.Item label="落地页展示类型" name="product_type" style={{ flex: 1, marginBottom: 0 }}>
              <Select size="large">
                <Select.Option value="standard">📄 标准型</Select.Option>
                <Select.Option value="project">🧱 项目型</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="发布状态" name="is_published" valuePropName="checked" style={{ marginBottom: 0 }}>
              <Switch checkedChildren="已发布" unCheckedChildren="草稿" />
            </Form.Item>
          </div>
        </Card>

        {/* 条件渲染内容区 */}
        {productType === "standard" ? (
          <Card title="标准型内容" bordered={false} style={{ marginBottom: 16 }}>
            <Form.Item label="下载链接" name="download_url">
              <Input size="large" />
            </Form.Item>
            <Form.Item label="详细描述" name="description">
              <TextArea rows={10} />
            </Form.Item>
          </Card>
        ) : (
          <Card title="🧱 积木模块配置" bordered={false} style={{ marginBottom: 16 }}>
            <Form.List name={["content", "features"]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: "flex", marginBottom: 16 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, "title"]}
                        rules={[{ required: true, message: "缺少标题" }]}
                      >
                        <Input placeholder="模块标题" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "description"]}
                        rules={[{ required: true, message: "缺少描述" }]}
                      >
                        <TextArea placeholder="详细内容描述..." autoSize={{ minRows: 1 }} style={{ width: "400px" }} />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} style={{ color: "red" }} />
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    添加新特性模块
                  </Button>
                </>
              )}
            </Form.List>
          </Card>
        )}
      </Form>
    </Edit>
  );
}
