import { criteria } from './NomineeValidations'

export const validateField = (event, formData, setFormData) => {
  const { name } = event.target
  let { value } = event.target

  // UserName formatting
  if (name === 'UserName') {
    value = value.replace(/[^A-Za-z ]/g, '')

    value = value
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  // Mobile formatting
  if (name === 'UserNumber') {
    value = value.replace(/[^0-9]/g, '').slice(0, 10)

    if (value.length === 1 && !/[6-9]/.test(value)) {
      value = ''
    }
  }

  const updatedFormData = formData.map(item => {
    if (item.name === name) {
      let error = ''

      for (const rule of item.validationRules) {
        if (criteria[rule]) {
          if (criteria[rule].regex && !criteria[rule].regex.test(value)) {
            error = criteria[rule].error
            break
          }

          if (criteria[rule].validate && !criteria[rule].validate(value)) {
            error = criteria[rule].error
            break
          }
        }
      }

      return {
        ...item,
        value,
        error
      }
    }

    return item
  })

  setFormData(updatedFormData)
}
