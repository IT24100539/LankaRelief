export default function Field({ prefix, id, label, required, error, children }) {
  return (
    <div className={`${prefix}__field`}>
      <label className={`${prefix}__label`} htmlFor={id}>
        {label}
        {required ? '*' : null}
      </label>
      {children}
      {error ? (
        <p className={`${prefix}__error`} id={`${id}-error`} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function createField(prefix) {
  return function PrefixedField(props) {
    return <Field prefix={prefix} {...props} />
  }
}
