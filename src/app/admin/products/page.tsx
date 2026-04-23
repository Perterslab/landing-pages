"use client";

import {
  List,
  useTable,
  TagField,
  EditButton,
  DeleteButton,
} from "@refinedev/antd";
import { Table, Space } from "antd";

export default function ProductList() {
  // useTable 会自动接管去 Supabase 抓取 products 表的数据，并处理分页
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  return (
    <List>
      {/* 必须使用 Antd 原生的 Table 组件，并将 tableProps 传给它 */}
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="name" title="软件名称" />
        <Table.Column 
          dataIndex="product_type" 
          title="落地页类型" 
          render={(value) => (
            <TagField 
              value={value === 'standard' ? '标准型' : '项目型'} 
              color={value === 'standard' ? 'blue' : 'purple'} 
            />
          )}
        />
        <Table.Column dataIndex="slug" title="访问路径 (Slug)" />
        <Table.Column 
          dataIndex="is_published" 
          title="状态" 
          render={(value) => (
            <TagField 
              value={value ? '已发布' : '草稿'} 
              color={value ? 'green' : 'default'} 
            />
          )}
        />
        <Table.Column
          title="操作"
          dataIndex="actions"
          render={(_, record: any) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
}