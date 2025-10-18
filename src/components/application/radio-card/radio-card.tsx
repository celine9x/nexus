import React from "react"
import { Button } from "@/components/base/buttons/button"

type InfoItem = {
  icon?: React.ReactNode
  text: string
}
type ButtonConfig = {
  label: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  disabled?: boolean
  onClick?: () => void
}
type RadioCardProps = {
  checked: boolean
  disabled?: boolean
  icon?: React.ReactNode
  title: string
  info: InfoItem[]
  button?: ButtonConfig
  name: string
  value: string
  onChange: () => void
  className?: string
}

export function RadioCard({
  checked,
  disabled = false,
  icon,
  title,
  info,
  button,
  name,
  value,
  onChange,
  className = "",
}: RadioCardProps) {
  const base =
    "w-full px-6 py-4 flex items-center gap-4 rounded-lg border outline-none bg-white transition cursor-pointer relative"
  const checkedStyle =
    "bg-blue-50 border-blue-500 shadow focus:ring-2 focus:ring-blue-200"
  const uncheckedStyle =
    "bg-white border-gray-200 hover:border-blue-300"
  const disabledStyle =
    "bg-gray-100 border-gray-200 cursor-default pointer-events-none opacity-60"
  const mainStyle = [
    base,
    checked ? checkedStyle : uncheckedStyle,
    disabled ? disabledStyle : "",
    className,
  ].join(" ")

  return (
    <label className={mainStyle}>
      {/* Custom Radio */}
      <span className="flex items-center mr-2">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          className="sr-only"
        />
        <span
          className={[
            "inline-flex w-4 h-4 rounded-full border",
            checked ? "border-blue-600 ring-2 ring-blue-300" : "border-gray-300",
            disabled ? "bg-gray-200" : "bg-white"
          ].join(" ")}
        >
          {checked && (
            <span className="w-2 h-2 m-auto rounded-full bg-blue-600 block" />
          )}
        </span>
      </span>
      <div className="flex flex-col flex-1 gap-1">
        <div className="flex items-center gap-2">
          {icon && <span className="w-5 h-5">{icon}</span>}
          <span className="text-[14px] font-medium text-blue-900">{title}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-xs">
          {info.map((i, idx) => (
            <React.Fragment key={idx}>
              <span className="flex items-center gap-1">
                {i.icon && <span className="w-4 h-4">{i.icon}</span>}
                {i.text}
              </span>
              {idx !== info.length - 1 && (
                <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mx-2" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      {button && (
       <Button
          size="sm"
          color="primary"
          isDisabled={button.disabled}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation()
            button.onClick && button.onClick()
          }}
          iconLeading={button.leftIcon}
          iconTrailing={button.rightIcon}
        >
          {button.label}
        </Button>
      )}
    </label>
  )
}
