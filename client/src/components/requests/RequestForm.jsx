import { useState } from 'react'
import { createRequest } from '../../api/requests.js'
import Button from '../shared/Button.jsx'
import Panel from '../shared/Panel.jsx'
import './RequestForm.css'

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

const CATEGORIES = [
  'Drinking water',
  'Dry rations',
  'Cooked meals',
  'Medicine',
  'Temporary shelter',
  'Transport',
]

const URGENCY = ['High', 'Medium', 'Low']

const EMPTY = {
  name: '',
  contact: '',
  district: '',
  location: '',
  category: '',
  urgency: '',
  description: '',
}

function isSriLankanMobile(value) {
  const normalized = String(value).replace(/\s+/g, '')
  return /^(07\d{8}|\+947\d{8})$/.test(normalized)
}

function validate(values) {
  const errors = {}

  if (!values.name.trim()) errors.name = 'Please enter your name'

  if (!values.contact.trim()) {
    errors.contact = 'Please enter a contact number'
  } else if (!isSriLankanMobile(values.contact)) {
    errors.contact = 'Please enter a valid Sri Lankan contact number'
  }

  if (!values.district) errors.district = 'Please select a district'
  if (!values.category) errors.category = 'Please select a category'
  if (!values.urgency) errors.urgency = 'Please select an urgency level'
  if (!values.description.trim()) errors.description = 'Please enter a description'

  return errors
}

function Field({
  id,
  label,
  required,
  error,
  children,
}) {
  return (
    <div className="request-form__field">
      <label className="request-form__label" htmlFor={id}>
        {label}
        {required ? '*' : null}
      </label>
      {children}
      {error ? (
        <p className="request-form__error" id={`${id}-error`} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export default function RequestForm({ onSubmit }) {
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

  function fieldProps(id) {
    const error = errors[id]
    return {
      id,
      className: `request-form__input${error ? ' is-invalid' : ''}`,
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
      const created = await createRequest(values)
      setValues(EMPTY)
      setErrors({})
      setAttempted(false)
      setSuccess(true)
      await onSubmit?.(created)
    } catch (err) {
      setFormError(
        err.response?.data?.message || 'Unable to submit request. Please try again.',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <Panel>
      <form className="request-form" onSubmit={handleSubmit} noValidate>
        {success ? (
          <p className="request-form__success" role="status">
            Your help request has been submitted.
          </p>
        ) : null}
        {formError ? (
          <p className="request-form__error" role="alert">
            {formError}
          </p>
        ) : null}
        <Field id="name" label="Requester name" required error={errors.name}>
          <input
            {...fieldProps('name')}
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={update('name')}
          />
        </Field>

        <Field id="contact" label="Contact number" required error={errors.contact}>
          <input
            {...fieldProps('contact')}
            type="text"
            inputMode="tel"
            autoComplete="tel"
            placeholder="07X XXX XXXX"
            value={values.contact}
            onChange={update('contact')}
          />
        </Field>

        <Field id="district" label="District" required error={errors.district}>
          <select
            {...fieldProps('district')}
            className={`request-form__select${errors.district ? ' is-invalid' : ''}`}
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

        <Field id="location" label="Location" error={errors.location}>
          <input
            {...fieldProps('location')}
            type="text"
            value={values.location}
            onChange={update('location')}
          />
        </Field>

        <Field id="category" label="Category" required error={errors.category}>
          <select
            {...fieldProps('category')}
            className={`request-form__select${errors.category ? ' is-invalid' : ''}`}
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

        <Field id="urgency" label="Urgency" required error={errors.urgency}>
          <select
            {...fieldProps('urgency')}
            className={`request-form__select${errors.urgency ? ' is-invalid' : ''}`}
            value={values.urgency}
            onChange={update('urgency')}
          >
            <option value="">Select urgency</option>
            {URGENCY.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </Field>

        <Field id="description" label="Description" required error={errors.description}>
          <textarea
            {...fieldProps('description')}
            className={`request-form__textarea${errors.description ? ' is-invalid' : ''}`}
            value={values.description}
            onChange={update('description')}
          />
        </Field>

        <Button
          type="submit"
          variant="urgent"
          className="request-form__submit"
          disabled={saving}
        >
          {saving ? 'Submitting…' : 'Submit request'}
        </Button>
      </form>
    </Panel>
  )
}
