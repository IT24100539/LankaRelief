import { useState } from 'react'
import { createNotice } from '../../api/notices.js'
import Button from '../shared/Button.jsx'
import Panel from '../shared/Panel.jsx'
import './NoticeForm.css'

const DISTRICTS = [
  'Colombo',
  'Kandy',
  'Galle',
  'Ratnapura',
  'Kalutara',
  'Matara',
  'Gampaha',
  'Kurunegala',
  'Jaffna',
  'Batticaloa',
]

const CATEGORIES = ['Flood', 'Landslide', 'Severe weather', 'General']
const SEVERITIES = ['High', 'Medium', 'Low']

const EMPTY = {
  title: '',
  district: '',
  category: '',
  severity: '',
  message: '',
}

function validate(values) {
  const errors = {}

  if (!values.title.trim()) errors.title = 'Please enter a title'
  if (!values.district) errors.district = 'Please select a district'
  if (!values.category) errors.category = 'Please select a category'
  if (!values.severity) errors.severity = 'Please select a severity'
  if (!values.message.trim()) errors.message = 'Please enter a message'

  return errors
}

function Field({ id, label, required, error, children }) {
  return (
    <div className="notice-form__field">
      <label className="notice-form__label" htmlFor={id}>
        {label}
        {required ? '*' : null}
      </label>
      {children}
      {error ? (
        <p className="notice-form__error" id={`${id}-error`} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export default function NoticeForm({ onSubmit }) {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [attempted, setAttempted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formError, setFormError] = useState('')

  function update(field) {
    return (event) => {
      const next = { ...values, [field]: event.target.value }
      setValues(next)
      if (attempted) setErrors(validate(next))
    }
  }

  function fieldProps(id, extraClass = 'notice-form__input') {
    const error = errors[id]
    return {
      id,
      className: `${extraClass}${error ? ' is-invalid' : ''}`,
      'aria-invalid': error ? true : undefined,
      'aria-describedby': error ? `${id}-error` : undefined,
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setAttempted(true)

    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setSaving(true)
    setSuccess(false)
    setFormError('')
    try {
      const created = await createNotice(values)
      setValues(EMPTY)
      setErrors({})
      setAttempted(false)
      setSuccess(true)
      await onSubmit?.(created)
    } catch (err) {
      setFormError(
        err.response?.data?.message || 'Unable to publish notice. Please try again.',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <Panel>
      <form className="notice-form" onSubmit={handleSubmit} noValidate>
        {success ? (
          <p className="notice-form__success" role="status">
            Notice published.
          </p>
        ) : null}
        {formError ? (
          <p className="notice-form__error" role="alert">
            {formError}
          </p>
        ) : null}
        <Field id="title" label="Title" required error={errors.title}>
          <input
            {...fieldProps('title')}
            type="text"
            value={values.title}
            onChange={update('title')}
          />
        </Field>

        <Field id="district" label="District" required error={errors.district}>
          <select
            {...fieldProps('district', 'notice-form__select')}
            value={values.district}
            onChange={update('district')}
          >
            <option value="">Select a district</option>
            {DISTRICTS.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </Field>

        <Field id="category" label="Category" required error={errors.category}>
          <select
            {...fieldProps('category', 'notice-form__select')}
            value={values.category}
            onChange={update('category')}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </Field>

        <Field id="severity" label="Severity" required error={errors.severity}>
          <select
            {...fieldProps('severity', 'notice-form__select')}
            value={values.severity}
            onChange={update('severity')}
          >
            <option value="">Select a severity</option>
            {SEVERITIES.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </Field>

        <Field id="message" label="Message" required error={errors.message}>
          <textarea
            {...fieldProps('message', 'notice-form__textarea')}
            value={values.message}
            onChange={update('message')}
          />
        </Field>

        <Button
          type="submit"
          variant="urgent"
          className="notice-form__submit"
          disabled={saving}
        >
          {saving ? 'Publishing…' : 'Publish notice'}
        </Button>
      </form>
    </Panel>
  )
}
