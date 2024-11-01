import { useModal } from '@ebay/nice-modal-react'

export const useModalRef = () => {
    const modal = useModal()

    const close = () => {
        modal.hide()

        setTimeout(() => {
            modal.remove()
        }, 300)
    }

    return { ...modal, close }
}
