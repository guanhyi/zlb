import { SysUserService } from '@/core/services/system/SysUserService'
import { create, useModal } from '@ebay/nice-modal-react'
import { useDependency } from '@wendellhu/redi/react-bindings'
import { Form, Input, Modal, Select } from 'antd'
import { RoleService } from '../role/role.service'
import { CodeService } from '@/core/services/code/code.service'
import { useMount } from 'ahooks'
import { useState } from 'react'
import { useModalRef } from '@/shared/hooks/useModalRef'
import { DeptCascader } from '@/shared/components/deptCascader/DeptCascader'
type P = {
    userid?: string
    deptId?: string
}

export const UserEdit = create((props: P) => {
    const modal = useModalRef()
    const sysUserService = useDependency(SysUserService)
    const sysRoleService = useDependency(RoleService)
    const [form] = Form.useForm()
    const codeService = useDependency(CodeService)
    const [roleList, setRoleList] = useState<{ value: string; label: string }[]>([])

    useMount(() => {
        if (props.deptId) {
            form.setFieldValue('deptId', props.deptId)
        }
        if (props.userid) {
            sysUserService.detail(props.userid).subscribe((res) => {
                // setUserInfo(res.data)

                form.setFieldsValue({
                    ...res.data,
                    //@ts-ignore
                    roleIdList: res.data.role.map((item) => item.roleId)
                })
            })
        }
        sysRoleService.list({}).subscribe((res) => {
            setRoleList(res.data.map((item) => ({ value: item.id, label: item.name })))
        })
    })

    const submit = () => {
        form.validateFields().then((values) => {
            let formData = values
            if (props.userid) {
                formData.id = props.userid
                sysUserService.save(formData).subscribe((res) => {
                    // console.log(res)
                    modal.resolve(true)
                    modal.hide()
                    setTimeout(() => {
                        modal.remove()
                    }, 300)
                })
            } else {
                sysUserService.newUser(formData).subscribe((res) => {
                    modal.resolve(true)
                    modal.hide()
                    setTimeout(() => {
                        modal.remove()
                    }, 300)
                    // console.log(res)
                })
            }
        })
    }

    return (
        <Modal
            open={modal.visible}
            onCancel={modal.close}
            confirmLoading={sysUserService.requestLoading.loading.value}
            onOk={submit}
            {...(props.userid ? { title: '编辑用户' } : { title: '新增用户' })}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="realName"
                    label="姓名"
                    rules={[{ required: true, message: '姓名' }]}
                >
                    <Input />
                </Form.Item>

                {/* <Form.Item name="gender" label="性别" rules={[{ required: true }]}> */}
                {/* <SysDictIpt  type="cascader" code={"sys_render"}></SysDictIpt> */}

                {/* <DictTreeSelect code="sys_gender" /> */}
                {/* </Form.Item> */}
                <Form.Item
                    name="username"
                    label=" 用户名"
                    rules={[{ required: true, message: ' 用户名' }]}
                >
                    <Input />
                </Form.Item>
                {/* <Form.Item
                    name="password"
                    label="密码"
                    rules={[{ required: true, message: '密码' }]}
                >
                    <Input />
                </Form.Item> */}

                <Form.Item name="mobile" label="手机号码" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="areaCode" label="所属地区" rules={[{ required: true }]}>
                    <Select options={codeService.getAreaCode()} />
                </Form.Item>

                <Form.Item name="deptId" label="所属部门" rules={[{ required: true }]}>
                    <DeptCascader />
                </Form.Item>
                <Form.Item name="roleIdList" label="角色" rules={[{ required: true }]}>
                    <Select mode={'multiple'} options={roleList} />
                </Form.Item>
            </Form>
        </Modal>
    )
})
