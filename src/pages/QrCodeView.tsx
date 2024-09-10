import { create, useModal } from '@ebay/nice-modal-react'
import { CenterPopup, Popup } from 'antd-mobile'
import QRCode from 'react-qr-code'
import styled from 'styled-components'
import dayjs from 'dayjs'
import { ScanConfigType } from '@/core/services/scanCode.service'
import { useAccountStote } from '@/core/services/account.service'
import SuccessIcon from '@/assets/succee.png'

const BoxStyled = styled.div({
    position: 'relative',
    zIndex: 99,
    margin: '14px',
    padding: '0 14px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    '.box-title': {
        fontSize: '18px'
    },
    '.box-time': {
        fontSize: '18px',
        color: '#006f4f',
        fontWeight: 'bold'
    }
})

const ItemStyled = styled.div({
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid #eee',
    padding: '20px 0',
    fontSize: '15px'
})

const BoxFooter = styled.div({
    padding: '25px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '.succees-text': {
        color: '#44b88e',
        fontWeight: 'bold'
    }
})

export const QrCodeView = create((props: { value: string; config: Partial<ScanConfigType> }) => {
    const modal = useModal()
    // const { state } = useAccountStote()
    const { state: userInfo } = useAccountStote()
    //
    const close = () => {
        modal.hide()

        modal.resolve()
        setTimeout(() => {
            modal.remove()
        }, 400)
    }
    return (
        <CenterPopup visible={modal.visible}>
            <div className="p-20px items-center justify-center flex flex-col">
                <QRCode value={props.value} />

                <BoxStyled>
                    <div className="flex items-center justify-center">
                        <div className="box-title  whitespace-nowrap ">访客登记</div>
                        <div className="box-time  whitespace-nowrap">
                            {dayjs().format('MM月DD日 HH:mm:ss')}
                        </div>
                    </div>

                    <ItemStyled>
                        <div className=" whitespace-nowrap">登记点</div>
                        <div className=" whitespace-nowrap ml-10px">{props.config.sceneName}</div>
                    </ItemStyled>

                    <ItemStyled>
                        <div className=" whitespace-nowrap">姓名</div>
                        <div className=" whitespace-nowrap ml-10px">
                            {userInfo.personInfo?.realName}
                        </div>
                    </ItemStyled>

                    <ItemStyled>
                        <div className=" whitespace-nowrap">身份证</div>
                        <div className=" whitespace-nowrap ml-10px">
                            {userInfo.personInfo?.idCard}
                        </div>
                    </ItemStyled>

                    <ItemStyled>
                        <div className=" whitespace-nowrap">联系方式</div>
                        <div className=" whitespace-nowrap ml-10px">
                            {userInfo.personInfo?.mobile}
                        </div>
                    </ItemStyled>

                    <BoxFooter>
                        <img src={SuccessIcon} width={66} height={66} />
                        <div className="flex mt-22px pb-22px">
                            <div className="succees-text">登记成功</div>
                            <div>,感谢您的支持</div>
                        </div>
                    </BoxFooter>
                </BoxStyled>
            </div>
        </CenterPopup>
    )
})
