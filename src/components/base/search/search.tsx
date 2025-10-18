import { type Ref, createContext, useContext, useRef, useEffect } from "react";
import { InfoCircle, SearchMd } from "@untitledui/icons";
import type { InputProps as AriaInputProps, TextFieldProps as AriaTextFieldProps } from "react-aria-components";
import { Group as AriaGroup, Input as AriaInput, TextField as AriaTextField } from "react-aria-components";

import { Label } from "@/components/base/input/label";
import { cx, sortCx } from "@/utils/cx";

export interface InputBaseProps extends TextFieldProps {
    /**
     * Input size.
     * @default "sm"
     */
    size?: "sm" | "md";
    /**
     * Input variant.
     * @default "default"
     */
    variant?: "default" | "ai";
    /** Placeholder text. */
    placeholder?: string;
    /** Class name for the icon. */
    iconClassName?: string;
    /** Class name for the input. */
    inputClassName?: string;
    /** Class name for the input wrapper. */
    wrapperClassName?: string;
    /** Keyboard shortcut to display. */
    shortcut?: string | boolean;
    ref?: Ref<HTMLInputElement>;
    groupRef?: Ref<HTMLDivElement>;
}

export const InputBase = ({
    ref,
    shortcut,
    groupRef,
    size = "sm",
    variant = "default",
    isInvalid,
    isDisabled,
    placeholder,
    wrapperClassName,
    inputClassName,
    iconClassName,
    // Omit this prop to avoid invalid HTML attribute warning
    isRequired: _isRequired,
    ...inputProps
}: Omit<InputBaseProps, "label">) => {
    // Check if the input has a leading icon
    const hasTrailingIcon = isInvalid;
    const hasLeadingIcon = true;

    // Mouse tracking for AI variant
    const mouseTrackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (variant !== "ai" || !mouseTrackRef.current) return;

        const element = mouseTrackRef.current;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = element.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            element.style.setProperty('--mouse-x', `${x}%`);
            element.style.setProperty('--mouse-y', `${y}%`);
        };

        element.addEventListener('mousemove', handleMouseMove);
        return () => element.removeEventListener('mousemove', handleMouseMove);
    }, [variant]);

    // If the input is inside a `TextFieldContext`, use its context to simplify applying styles
    const context = useContext(TextFieldContext);

    const inputSize = context?.size || size;

    const sizes = sortCx({
        sm: {
            root: cx("px-3 py-2", hasTrailingIcon && "pr-9", hasLeadingIcon && "pl-10"),
            iconLeading: "left-3",
            iconTrailing: "right-3",
            shortcut: "pr-2.5",
        },
        md: {
            root: cx("px-3.5 py-2.5", hasTrailingIcon && "pr-9.5", hasLeadingIcon && "pl-10.5"),
            iconLeading: "left-3.5",
            iconTrailing: "right-3.5",
            shortcut: "pr-3",
        },
    });

    return (
        <AriaGroup
            {...{ isDisabled, isInvalid }}
            ref={(node) => {
                if (groupRef) {
                    if (typeof groupRef === 'function') {
                        groupRef(node);
                    } else {
                        groupRef.current = node;
                    }
                }
                if (mouseTrackRef.current !== node) {
                    mouseTrackRef.current = node;
                }
            }}
            className={({ isFocusWithin, isDisabled, isInvalid }) => {
                const isFocused = isFocusWithin && !isDisabled;
                return cx(
                    "group relative flex w-full flex-row place-content-center place-items-center rounded-full shadow-xs transition-shadow duration-100 ease-linear",

                    // Variant styles
                    variant === "default" && "bg-primary ring-1 ring-primary ring-inset",
                    variant === "ai" && "bg-gradient-to-r from-[rgb(83,223,160)] via-[rgb(39,208,216)] to-[rgb(51,153,255)] p-px",

                    isFocused && variant === "default" && "ring-2 ring-brand ring-inset",

                    // Disabled state styles
                    isDisabled && "cursor-not-allowed bg-disabled_subtle ring-disabled",
                    "group-disabled:cursor-not-allowed group-disabled:bg-disabled_subtle group-disabled:ring-disabled",

                    // Invalid state styles
                    isInvalid && "ring-error_subtle",
                    "group-invalid:ring-error_subtle",

                    // Invalid state with focus-within styles
                    isInvalid && isFocusWithin && "ring-1 ring-error",
                    isFocusWithin && "group-invalid:ring-1 group-invalid:ring-error",

                    context?.wrapperClassName,
                    wrapperClassName,
                );
            }}
        >
            {variant === "ai" && (
                <>

                    {/* Interactive cursor-following shimmer - 40% boost */}
                    <div
                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{
                            background: `radial-gradient(circle 50px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,1) 0%, rgba(83,223,160,0.9) 20%, rgba(39,208,216,0.7) 40%, transparent 60%)`,
                            pointerEvents: 'none',
                            mixBlendMode: 'screen'
                        }}
                    />

                    {/* Additional interactive glow layer - 40% boost */}
                    <div
                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-200"
                        style={{
                            background: `radial-gradient(circle 80px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.6) 0%, rgba(83,223,160,0.8) 25%, rgba(39,208,216,0.6) 50%, rgba(51,153,255,0.4) 75%, transparent 100%)`,
                            pointerEvents: 'none',
                            filter: 'blur(1px)'
                        }}
                    />

                    {/* Interactive background glow - 40% boost */}
                    <div
                        className="absolute -inset-1 rounded-full opacity-30 group-hover:opacity-70 blur-[3px] transition-opacity duration-300"
                        style={{
                            background: `radial-gradient(ellipse, rgba(83,223,160,0.5) 0%, rgba(39,208,216,0.4) 50%, transparent 100%)`,
                            animation: 'ai-pulse 4s ease-in-out infinite'
                        }}
                    />

                    {/* Cursor-reactive background enhancement - 40% boost */}
                    <div
                        className="absolute -inset-2 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-200"
                        style={{
                            background: `radial-gradient(circle 120px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(83,223,160,0.6) 0%, rgba(39,208,216,0.5) 30%, rgba(51,153,255,0.4) 60%, transparent 100%)`,
                            pointerEvents: 'none',
                            filter: 'blur(4px)'
                        }}
                    />

                    {/* Inner background */}
                    <div className="absolute inset-px rounded-full bg-primary transition-all duration-100 z-[1]" />
                </>
            )}
            {/* Leading search icon */}
            <SearchMd
                className={cx(
                    "pointer-events-none absolute size-5 text-fg-quaternary z-10",
                    isDisabled && "text-fg-disabled",
                    sizes[inputSize].iconLeading,
                    context?.iconClassName,
                    iconClassName,
                )}
            />

            {/* Input field */}
            <AriaInput
                {...(inputProps as AriaInputProps)}
                ref={ref}
                placeholder={placeholder}
                className={cx(
                    "relative z-10 m-0 w-full bg-transparent text-md text-primary ring-0 outline-hidden placeholder:text-placeholder autofill:rounded-full autofill:text-primary",
                    isDisabled && "cursor-not-allowed text-disabled",
                    sizes[inputSize].root,
                    context?.inputClassName,
                    inputClassName,
                )}
            />

            {/* Invalid icon */}
            {isInvalid && (
                <InfoCircle
                    className={cx(
                        "pointer-events-none absolute size-4 text-fg-error-secondary z-10",
                        sizes[inputSize].iconTrailing,
                    )}
                />
            )}

            {/* Shortcut */}
            {shortcut && (
                <div
                    className={cx(
                        "pointer-events-none absolute inset-y-0.5 right-0.5 z-10 flex items-center rounded-r-[inherit] bg-linear-to-r from-transparent to-bg-primary to-40% pl-8",
                        sizes[inputSize].shortcut,
                    )}
                >
                    <span
                        className={cx(
                            "pointer-events-none rounded px-1 py-px text-xs font-medium text-quaternary ring-1 ring-secondary select-none ring-inset",
                            isDisabled && "bg-transparent text-disabled",
                        )}
                        aria-hidden="true"
                    >
                        {typeof shortcut === "string" ? shortcut : "⌘K"}
                    </span>
                </div>
            )}
        </AriaGroup>
    );
};

InputBase.displayName = "InputBase";

interface BaseProps {
    /** Label text for the input */
    label?: string;
}

interface TextFieldProps
    extends BaseProps,
        AriaTextFieldProps,
        Pick<InputBaseProps, "size" | "variant" | "wrapperClassName" | "inputClassName" | "iconClassName"> {
    ref?: Ref<HTMLDivElement>;
}

const TextFieldContext = createContext<TextFieldProps>({});

export const TextField = ({ className, ...props }: TextFieldProps) => {
    return (
        <TextFieldContext.Provider value={props}>
            <AriaTextField
                {...props}
                data-input-wrapper
                className={(state) =>
                    cx("group flex h-max w-full flex-col items-start justify-start gap-1.5", typeof className === "function" ? className(state) : className)
                }
            />
        </TextFieldContext.Provider>
    );
};

TextField.displayName = "TextField";

interface InputProps extends InputBaseProps, BaseProps {
    /** Whether to hide required indicator from label */
    hideRequiredIndicator?: boolean;
}

export const Search = ({
    size = "sm",
    variant = "default",
    label,
    shortcut,
    hideRequiredIndicator,
    className,
    ref,
    groupRef,
    iconClassName,
    inputClassName,
    wrapperClassName,
    ...props
}: InputProps) => {
    return (
        <TextField aria-label={!label ? "Search" : undefined} {...props} className={className}>
            {({ isRequired }) => (
                <>
                    {label && <Label isRequired={hideRequiredIndicator ? !hideRequiredIndicator : isRequired}>{label}</Label>}

                    <InputBase
                        {...{
                            ref,
                            groupRef,
                            size,
                            variant,
                            placeholder: "Search",
                            shortcut,
                            iconClassName,
                            inputClassName,
                            wrapperClassName,
                        }}
                    />
                </>
            )}
        </TextField>
    );
};

Search.displayName = "Search";
