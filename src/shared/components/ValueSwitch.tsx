import { Switch, SwitchProps } from 'antd'
import { useEffect, useState } from 'react'

type valueType = string | boolean | number
export const ValueSwitch = ({
    checked,
    value,
    checkedValue = true,
    uncheckedValue = false,
    onChange,
    ...props
}: SwitchProps & {
    value?: valueType
    checkedValue?: valueType
    uncheckedValue?: valueType
    onChange?: (value: valueType) => void
}) => {
    const [_checked, setChecked] = useState(checked)

    useEffect(() => {
        setChecked(value === checkedValue)
    }, [value])

    return (
        <Switch
            checked={_checked}
            onChange={(c) => {
                if (c) {
                    onChange && onChange(checkedValue)
                } else {
                    onChange && onChange(uncheckedValue)
                }
            }}
            {...props}
        />
    )
}
