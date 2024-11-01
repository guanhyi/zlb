import { ValueSwitch } from '@/shared/components/ValueSwitch'
import { create, useModal } from '@ebay/nice-modal-react'
import { Col, Divider, Flex, Form, Input, InputNumber, Modal, Radio, Row } from 'antd'
import { MenuCascader } from './components/MenuCascader'
import { SysMenuService, SysMenuVO } from '@/core/services/menu.service'
import { useMount } from 'ahooks'
import { useDependency } from '@wendellhu/redi/react-bindings'
import { MenuButtonResources } from './components/Resources'
import { Show } from '@/shared/components/control/Show'
import { useRef } from 'react'

const menuModule: Omit<SysMenuVO, 'id' | 'meta' | 'children'> = {
    name: '',
    title: '',
    path: '',
    component: '',
    authority: '',
    type: 0,
    openStyle: 0,
    icon: '',
    sort: 0,
    affix: 0,
    tag: '',
    hidden: 0,
    hiddenBreadcrumb: 0,
    version: '0',
    pid: '0'
}

export const MenuForm = create((props: { item?: Partial<SysMenuVO> }) => {
    const modal = useModal()
    const sysMenuService = useDependency(SysMenuService)
    const getResourcesRef = useRef<() => Partial<SysMenuVO>[]>(() => [])
    const [form] = Form.useForm()

    const close = () => {
        modal.hide()
        setTimeout(() => {
            modal.remove()
        }, 300)
    }

    useMount(() => {
        if (props.item) {
            form.setFieldsValue(props.item)
        }
    })

    const save = () => {
        sysMenuService
            .menuSave({
                ...props.item,
                ...form.getFieldsValue(),
                buttonList: getResourcesRef.current && getResourcesRef.current()
            })
            .subscribe((res) => {
                modal.resolve(res)
                close()
            })
    }

    const add = () => {
        sysMenuService
            .menuSave({
                ...menuModule,
                ...form.getFieldsValue(),
                buttonList: getResourcesRef.current && getResourcesRef.current()
            })
            .subscribe((res) => {
                modal.resolve(res)
                close()
            })
    }

    const finish = () => {
        if (props.item && props.item.id) {
            save()
        } else {
            add()
        }
    }

    return (
        <Modal
            onCancel={close}
            open={modal.visible}
            onOk={finish}
            loading={sysMenuService.requestLoading.loading.value}
            confirmLoading={sysMenuService.requestLoading.loading.value}
            {...(props.item && props.item.id
                ? {
                      title: '修改菜单',
                      okText: '保存',
                      width: 1000
                  }
                : {
                      title: '新增菜单',
                      okText: '新增',
                      width: 600
                  })}
        >
            <Row gutter={20}>
                <Col span={props.item && props.item.id ? 14 : 24}>
                    <Form
                        form={form}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        layout="horizontal"
                    >
                        <Form.Item
                            name="title"
                            label="显示名称"
                            rules={[{ required: true, message: '显示名称必填' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item name="pid" label="上级菜单">
                            <MenuCascader />
                        </Form.Item>
                        <Form.Item name="type" label="类型" rules={[{ required: true }]}>
                            <Radio.Group buttonStyle="solid">
                                <Radio.Button value={0}>菜单</Radio.Button>
                                <Radio.Button value={2}>Iframe</Radio.Button>
                                <Radio.Button value={3}>外链</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item name="name" label="别名">
                            <Input />
                        </Form.Item>
                        {/* <Form.Item name="icon" label="菜单图标">
                    <InputIcon />
                </Form.Item> */}
                        <Form.Item name="authority" label="权限标识">
                            <Input />
                        </Form.Item>
                        <Form.Item name="path" label="路由地址">
                            <Input />
                        </Form.Item>

                        <Form.Item name="tag" label="标签">
                            <Input />
                        </Form.Item>
                        <Form.Item name="sort" label="排序">
                            <InputNumber />
                        </Form.Item>
                        <Form.Item name="hidden" label="隐藏菜单">
                            <ValueSwitch uncheckedValue={0} checkedValue={1}></ValueSwitch>
                        </Form.Item>
                        <Form.Item name="hiddenBreadcrumb" label="隐藏面包屑">
                            <ValueSwitch uncheckedValue={0} checkedValue={1}></ValueSwitch>
                        </Form.Item>
                    </Form>
                </Col>
                <Show when={props.item?.id}>
                    {(ID) => (
                        <Col span={10}>
                            <MenuButtonResources
                                getData={(ref) => {
                                    getResourcesRef.current = ref
                                }}
                                menuId={ID}
                            />
                        </Col>
                    )}
                </Show>
            </Row>
        </Modal>
    )
})
