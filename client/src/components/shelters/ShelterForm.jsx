import { useState } from 'react'
import { createShelter } from '../../api/shelters.js'
import { DISTRICTS } from '../../constants/districts.js'
import { isSriLankanMobile } from '../../utils/phone.js'
import Button from '../shared/Button.jsx'
import { createField } from '../shared/Field.jsx'
import Panel from '../shared/Panel.jsx'
import './ShelterForm.css'

const Field = createField('shelter-form')

const EMPTY = {
  name: '',
  district: '',
  contact: '',
  address: '',
  totalCapacity: '',
  availableSpaces: '',
  facilities: '',
}

function validate(values) {
  const errors = {}

  if (!values.name.trim()) errors.name = 'Please enter the shelter name'
  if (!values.district) errors.district = 'Please select a district'

  if (values.contact.trim() && !isSriLankanMobile(values.contact)) {
    errors.contact = 'Please enter a valid Sri Lankan contact number'
  }

  if (!values.address.trim()) errors.address = 'Please enter an address'

  const totalCapacity = Number(values.totalCapacity)
  if (values.totalCapacity === '' || values.totalCapacity === null) {
    errors.totalCapacity = 'Please enter a total capacity'
  } else if (!Number.isFinite(totalCapacity) || totalCapacity <= 0) {
    errors.totalCapacity = 'Total capacity must be greater than zero'
  }

  const availableSpaces = Number(values.availableSpaces)
  if (values.availableSpaces === '' || values.availableSpaces === null) {
    errors.availableSpaces = 'Please enter available spaces'
  } else if (!Number.isFinite(availableSpaces) || availableSpaces < 0) {
    errors.availableSpaces = 'Available spaces cannot be negative'
  } else if (
    Number.isFinite(totalCapacity) &&
    totalCapacity > 0 &&
    availableSpaces > totalCapacity
  ) {
    errors.availableSpaces = 'Available spaces cannot exceed total capacity'
  }

  return errors
}

function mapBackendError(message) {
  const text = String(message).toLowerCase()
  if (text.includes('available spaces')) return { availableSpaces: message }
  if (text.includes('total capacity')) return { totalCapacity: message }
  if (text.includes('shelter name')) return { name: message }
  if (text.includes('district')) return { district: message }
  if (text.includes('address')) return { address: message }
  if (text.includes('contact')) return { contact: message }
  return null
}

export default function ShelterForm({ onSubmit }) {
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

  function fieldProps(id, extraClass = 'shelter-form__input') {
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

    const payload = {
      ...values,
      totalCapacity: Number(values.totalCapacity),
      availableSpaces: Number(values.availableSpaces),
    }

    setSaving(true)
    setSuccess(false)
    setFormError('')
    try {
      const created = await createShelter(payload)
      setValues(EMPTY)
      setErrors({})
      setAttempted(false)
      setSuccess(true)
      await onSubmit?.(created)
    } catch (err) {
      const message =
        err.response?.data?.message || 'Unable to save shelter. Please try again.'
      const fieldErrors = mapBackendError(message)
      if (fieldErrors) {
        setErrors(fieldErrors)
      } else {
        setFormError(message)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <Panel>
      <form className="shelter-form" onSubmit={handleSubmit} noValidate>
        {success ? (
          <p className="shelter-form__success" role="status">
            Shelter saved.
          </p>
        ) : null}
        {formError ? (
          <p className="shelter-form__error" role="alert">
            {formError}
          </p>
        ) : null}
        <Field id="name" label="Shelter name" required error={errors.name}>
          <input
            {...fieldProps('name')}
            type="text"
            value={values.name}
            onChange={update('name')}
          />
        </Field>

        <Field id="district" label="District" required error={errors.district}>
          <select
            {...fieldProps('district', 'shelter-form__select')}
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

        <Field id="contact" label="Contact" error={errors.contact}>
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

        <Field id="address" label="Address / location" required error={errors.address}>
          <input
            {...fieldProps('address')}
            type="text"
            value={values.address}
            onChange={update('address')}
          />
        </Field>

        <Field
          id="totalCapacity"
          label="Total capacity"
          required
          error={errors.totalCapacity}
        >
          <input
            {...fieldProps('totalCapacity')}
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            value={values.totalCapacity}
            onChange={update('totalCapacity')}
          />
        </Field>

        <Field
          id="availableSpaces"
          label="Available spaces"
          required
          error={errors.availableSpaces}
        >
          <input
            {...fieldProps('availableSpaces')}
            type="number"
            inputMode="numeric"
            min="0"
            max={values.totalCapacity === '' ? undefined : values.totalCapacity}
            step="1"
            value={values.availableSpaces}
            onChange={update('availableSpaces')}
          />
        </Field>

        <Field id="facilities" label="Facilities" error={errors.facilities}>
          <input
            {...fieldProps('facilities')}
            type="text"
            placeholder="water, electricity, toilets"
            value={values.facilities}
            onChange={update('facilities')}
          />
        </Field>

        <Button
          type="submit"
          variant="dark"
          className="shelter-form__submit"
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Save shelter'}
        </Button>
      </form>
    </Panel>
  )
}
