import { create, useModal } from '@ebay/nice-modal-react'
import { useDependency } from '@wendellhu/redi/react-bindings'
import { Form, Input, Modal, Select } from 'antd'
import { RoleService, SysRole } from './role.service'
import { useMount } from 'ahooks'

export const RoleForm = create((props: SysRole) => {
    const modal = useModal()
    const [form] = Form.useForm()
    const roleService = useDependency(RoleService)
    const close = () => {
        modal.hide()
        modal.resolve(true)
        setTimeout(() => {
            modal.remove()
        }, 300)
    }

    useMount(() => {
        if (props?.id) {
            roleService.detail(props.id).subscribe((res) => {
                form.setFieldsValue(res.data)
            })
        }
    })
    const submit = () => {
        form.validateFields().then((res) => {
            if (props?.id) {
                roleService.save({ ...{ id: props.id }, ...res }).subscribe(() => {
                    modal.resolve(1)
                    close()
                })
            } else {
                roleService.newSand(res).subscribe(() => {
                    modal.resolve(1)
                    close()
                })
            }
        })
    }

    return (
        <Modal
            confirmLoading={
                roleService.saveLoading.loading.value ||
                roleService.addLoading.loading.value ||
                roleService.findLoading.loading.value
            }
            title="角色"
            open={modal.visible}
            onCancel={close}
            onOk={submit}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="name"
                    label="角色名称"
                    rules={[{ required: true, message: '角色名称必填' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="status"
                    label="状态"
                    rules={[{ required: true, message: '状态必填' }]}
                >
                    <Select
                        options={[
                            { value: 1, label: '启用' },
                            { value: 0, label: '禁用' }
                        ]}
                    />
                </Form.Item>

                <Form.Item name="remark" label="备注">
                    <Input.TextArea />
                </Form.Item>
            </Form>
        </Modal>
    )
})
