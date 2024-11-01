import { CodeService } from '@/core/services/code/code.service'
import { SysDeptService, SysDeptVO } from '@/core/services/system/SysDeptService'
import { useModalRef } from '@/shared/hooks/useModalRef'
import { create, useModal } from '@ebay/nice-modal-react'
import { useDependency } from '@wendellhu/redi/react-bindings'
import { Form, Input, Modal, Select } from 'antd'
import { useState } from 'react'
import { useMount } from 'ahooks'

export const DeptEdit = create((props: SysDeptVO & { isAdd: boolean }) => {
    const modal = useModalRef()
    const [form] = Form.useForm()
    const [pid, setPid] = useState('')
    const sysDeptService = useDependency(SysDeptService)
    const codeService = useDependency(CodeService)
    useMount(() => {
        if (props.isAdd) {
            if (props.id === '0') {
                setPid('0')
            } else {
                setPid(props.id)
            }
            sysDeptService.detail(props.id).subscribe((res) => {
                form.setFieldsValue({
                    pName: res.data.name
                })
            })
        } else {
            setPid(props.pid || '')
            sysDeptService.detail(props.id).subscribe((res) => {
                form.setFieldsValue(res.data)
                if (props.pid === '0') {
                    form.setFieldsValue({
                        pName: '无'
                    })
                } else {
                    sysDeptService.detail(res.data!.pid || '').subscribe((res) => {
                        form.setFieldsValue({
                            pName: res.data.name
                        })
                    })
                }
            })
        }
    })

    const submit = () => {
        form.validateFields().then(({ pName, ...values }) => {
            let newData = { ...values, pid }
            if (props.isAdd) {
                sysDeptService.newSand(newData).subscribe(() => {
                    modal.resolve(true)
                    modal.hide()
                    setTimeout(() => {
                        modal.remove()
                    }, 300)
                })
            } else {
                newData.id = props.id
                sysDeptService.save(newData).subscribe(() => {
                    modal.resolve(true)
                    modal.hide()
                    setTimeout(() => {
                        modal.remove()
                    }, 300)
                })
            }
        })
    }

    return (
        <Modal
            open={modal.visible}
            onOk={submit}
            onCancel={modal.close}
            loading={sysDeptService.requestLoading.loading.value}
            confirmLoading={sysDeptService.requestLoading.loading.value}
            title={props.isAdd ? '新增部门' : '编辑部门'}
        >
            <Form form={form} layout="vertical">
                <Form.Item name="pName" label="上级部门">
                    <Input disabled />
                </Form.Item>
                <Form.Item
                    name="name"
                    label="部门名称"
                    rules={[{ required: true, message: '部门名称必填' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name="areaCode" label="所属地区" rules={[{ required: true }]}>
                    <Select options={codeService.getAreaCode()} />
                </Form.Item>

                <Form.Item name="remark" label="备注">
                    <Input.TextArea />
                </Form.Item>
            </Form>
        </Modal>
    )
})
