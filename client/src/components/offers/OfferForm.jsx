import { useState } from 'react'
import { createOffer } from '../../api/offers.js'
import { DISTRICTS } from '../../constants/districts.js'
import { OFFER_STATUSES, RESOURCE_TYPES } from '../../constants/enums.js'
import { isSriLankanMobile } from '../../utils/phone.js'
import Button from '../shared/Button.jsx'
import { createField } from '../shared/Field.jsx'
import Panel from '../shared/Panel.jsx'
import './OfferForm.css'

const Field = createField('offer-form')

const EMPTY = {
  volunteerName: '',
  contact: '',
  district: '',
  resourceType: '',
  quantity: '',
  availabilityStatus: 'Available',
  notes: '',
}

function validate(values) {
  const errors = {}

  if (!values.volunteerName.trim()) {
    errors.volunteerName = 'Please enter the volunteer or organization name'
  }

  if (!values.contact.trim()) {
    errors.contact = 'Please enter a contact number'
  } else if (!isSriLankanMobile(values.contact)) {
    errors.contact = 'Please enter a valid Sri Lankan contact number'
  }

  if (!values.district) errors.district = 'Please select a district'
  if (!values.resourceType) errors.resourceType = 'Please select a resource type'

  const quantity = Number(values.quantity)
  if (values.quantity === '' || values.quantity === null) {
    errors.quantity = 'Please enter a quantity'
  } else if (!Number.isFinite(quantity) || quantity <= 0) {
    errors.quantity = 'Quantity must be greater than zero'
  }

  if (!values.availabilityStatus) {
    errors.availabilityStatus = 'Please select availability'
  }

  return errors
}

export default function OfferForm({ onSubmit }) {
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

  function fieldProps(id, extraClass = 'offer-form__input') {
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
      quantity: Number(values.quantity),
    }

    setSaving(true)
    setSuccess(false)
    setFormError('')
    try {
      const created = await createOffer(payload)
      setValues(EMPTY)
      setErrors({})
      setAttempted(false)
      setSuccess(true)
      await onSubmit?.(created)
    } catch (err) {
      setFormError(
        err.response?.data?.message || 'Unable to submit offer. Please try again.',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <Panel>
      <form className="offer-form" onSubmit={handleSubmit} noValidate>
        {success ? (
          <p className="offer-form__success" role="status">
            Your resource offer has been submitted.
          </p>
        ) : null}
        {formError ? (
          <p className="offer-form__error" role="alert">
            {formError}
          </p>
        ) : null}
        <Field
          id="volunteerName"
          label="Volunteer / organization"
          required
          error={errors.volunteerName}
        >
          <input
            {...fieldProps('volunteerName')}
            type="text"
            autoComplete="name"
            value={values.volunteerName}
            onChange={update('volunteerName')}
          />
        </Field>

        <Field id="contact" label="Contact" required error={errors.contact}>
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
            {...fieldProps('district', 'offer-form__select')}
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

        <Field
          id="resourceType"
          label="Resource type"
          required
          error={errors.resourceType}
        >
          <select
            {...fieldProps('resourceType', 'offer-form__select')}
            value={values.resourceType}
            onChange={update('resourceType')}
          >
            <option value="">Select a resource type</option>
            {RESOURCE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>

        <Field
          id="quantity"
          label="Quantity / capacity"
          required
          error={errors.quantity}
        >
          <input
            {...fieldProps('quantity')}
            type="number"
            min="1"
            step="1"
            value={values.quantity}
            onChange={update('quantity')}
          />
        </Field>

        <Field
          id="availabilityStatus"
          label="Availability"
          required
          error={errors.availabilityStatus}
        >
          <select
            {...fieldProps('availabilityStatus', 'offer-form__select')}
            value={values.availabilityStatus}
            onChange={update('availabilityStatus')}
          >
            {OFFER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </Field>

        <Field id="notes" label="Notes" error={errors.notes}>
          <textarea
            {...fieldProps('notes', 'offer-form__textarea')}
            value={values.notes}
            onChange={update('notes')}
          />
        </Field>

        <Button
          type="submit"
          variant="dark"
          className="offer-form__submit"
          disabled={saving}
        >
          {saving ? 'Submitting…' : 'Submit offer'}
        </Button>
      </form>
    </Panel>
  )
}
