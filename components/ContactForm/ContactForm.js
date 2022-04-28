import emailjs from '@emailjs/browser';
import { set } from 'lodash';
import { useState } from 'react';

const ContactForm = () => {
  // const templateParams = {
  //   'first_name': '',
  //   'last_name': '',
  //   'user_email': '',
  //   'organization': '',
  //   'what_looking': '',
  //   'message': '', 
  // }

  const [fieldsData, setFieldsData] = useState({
    'first_name': '',
    'last_name': '',
    'user_email': '',
    'organization': '',
    'what_looking': '',
    'message': '', 
  });
  const [errMessage, setErrMessage] = useState('');

  // const validateForm = () => {
  //   const invalidFields = Object.keys(fieldsData).reduce((acc, item) => {
  //     if (!fieldsData[item] && item !== 'message') {
  //       acc.push(item)
  //     }

  //     return acc;
  //   },[]);

  //   if (invalidFields.length) {
  //     console.log('invalid fields, adding error styles...')
  //     invalidFields.forEach(item => document.querySelector(`[name="${item}"]`).classList.add('error'));
  //     setErrMessage('Some fields were filled incorrectly...')
  //   } else {
  //     console.log("clearing error styles...")
  //     setErrMessage('');
  //     document.querySelector('.error').classList.remove('error');
  //   }
  // }

  const validateField = (e) => {
    if (!e.target.value) {

    }
  }

  const sendEmail = (e) => {
    e.preventDefault();

    // Validate form
    // validateForm();
    // console.log('templateParams:', templateParams)
    // if (
    //   !templateParams['first_name'] || 
    //   !templateParams['first_name'] || 
    //   !templateParams['first_name']
    // ) {
    //   // Highlight fields with error message
    // }

    const form = document.getElementById('contactForm');

    // emailjs.sendForm('service_98lgg2i', 'contact_form', form, 'mmK3OKeHIopjzpZnQ')
    //   .then((result) => {
    //       console.log(result.text);
    //   }, (error) => {
    //       console.log(error.text);
    //   });
  };

  const updateParams = (e) => {
    const updatedData = {...fieldsData};
    updatedData[e.target.name] = e.target.value;
    setFieldsData(updatedData)
    
    console.log("e:", e)
    if (!e.target.value && e.key !== "Tab") {
      e.target.classList.add('error');
      setErrMessage('Some fields were filled incorrectly...')
    } else {
      e.target.classList.remove('error');
    }
    const invalidFields = Object.keys(fieldsData).reduce((acc, item) => {
      if (!fieldsData[item] && item !== 'message') {
        acc.push(item)
      }

      return acc;
    },[]);

    if (!invalidFields.length) {
      setErrMessage('')
    }
  }

  return (
    <form id="contactForm" action="?" method="POST" className="form">
      <div className="form-group half">
        <label>First Name *</label>
        <input 
          type="text" 
          name="first_name" 
          onKeyUp={(e) => updateParams(e)} 
          onBlur={(e) => validateField(e)}
        />

      </div>
      <div className="form-group half">
        <label>Last Name *</label>
        <input 
          type="text" 
          name="last_name" 
          onKeyUp={(e) => updateParams(e)} 
          onBlur={(e) => validateField(e)}
        />
      </div>
      <div className="form-group half">
        <label>Email *</label>
        <input 
          type="email" 
          name="user_email" 
          onKeyUp={(e) => updateParams(e)} 
          onBlur={(e) => validateField(e)}
        />
      </div>
      <div className="form-group half">
        <label>Organization *</label>
        <input 
          type="text" 
          name="organization" 
          onKeyUp={(e) => updateParams(e)} 
          onBlur={(e) => validateField(e)}
        />
      </div>
      <div className="form-group">
        <label>What are you looking for? *</label>
        <input 
          type="text" 
          name="what_looking" 
          onKeyUp={(e) => updateParams(e)} 
          onBlur={(e) => validateField(e)}
        />
      </div>
      <div className="form-group">
        <label>Message</label>
        <textarea name="message" onKeyUp={(e) => updateParams(e)} />
      </div>
      <button 
        type="button" 
        className="submit-button"
        onClick={sendEmail}
      >Submit</button>
      <div className="error-message" style={{color: 'red'}}>
        {errMessage}
      </div>
    </form>
  );
}

export default ContactForm;
