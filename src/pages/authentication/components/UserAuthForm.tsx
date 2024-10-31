// import { AuthService } from '@/core/services/auth/auth.service'

// import { RouterService } from '@/core/services/router.service'
// import SysMenuService from '@/core/services/system/SysMenuService'
import { useAuthStore } from '@/core/services/auth.service'
import { LoginService } from '@/core/services/login.service'
import { SysMenuService, useMenuStore } from '@/core/services/menu.service'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { useDependency } from '@wendellhu/redi/react-bindings'
import { Button, Form, Input } from 'antd'
import { useNavigate } from 'react-router-dom'

export const UserAuthForm = () => {
    const [form] = Form.useForm()
    const loginService = useDependency(LoginService)
    const { setToken, setAuth, setUser } = useAuthStore()
    // const authService = useDependency(AuthService)
    const menuService = useDependency(SysMenuService)
    const { setMenu } = useMenuStore()
    // const routerService = useDependency(RouterService)
    const navigate = useNavigate()
    const submit = (values: any) => {
        loginService.login(values).subscribe((res) => {
            setToken(res.data.token)
            setUser(res.data)
            // setAuth(authButton.data)
            menuService.getAuthList().subscribe(([authButton, authRouter]) => {
                setAuth(authButton.data)
                setMenu(menuService.filterMenu(authRouter.data))
                // authService.setAuthMenuList(authRouter.data)
                navigate('/')
            })
        })
    }

    return (
        <Form form={form} onFinish={submit}>
            <Form.Item rules={[{ required: true, message: '请输入用户名' }]} name="username">
                <Input
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="请输入用户名"
                />
            </Form.Item>
            <Form.Item rules={[{ required: true, message: '请输入密码' }]} name="password">
                <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    placeholder="请输入密码"
                />
            </Form.Item>

            <Button htmlType="submit" type="primary" block>
                登录
            </Button>
        </Form>
    )
}
