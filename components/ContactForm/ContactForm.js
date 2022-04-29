import emailjs from '@emailjs/browser';
import { set } from 'lodash';
import Link from 'next/link';
import { useState } from 'react';

const ContactForm = () => {
  const [errMessage, setErrMessage] = useState('');
  const [thankYouMessage, setThankYouMessage] = useState(false);
  const [fieldsData, setFieldsData] = useState({
    'first_name': '',
    'last_name': '',
    'user_email': '',
    'organization': '',
    'what_looking': '',
    'message': '', 
  });

  const sendEmail = (e) => {
    e.preventDefault();
    const form = document.getElementById('contactForm');

    emailjs.sendForm('service_98lgg2i', 'contact_form', form, 'mmK3OKeHIopjzpZnQ')
      .then((result) => {
          console.log('result:',result);
          if (result.status === 200) {
            // Display thank you message..
            setThankYouMessage(true);
          } else {
            setErrMessage("We're sorry, something went wrong.");
          }
      }, (error) => {
          console.log(error.text);
      });
  };

  const validateField = (e) => {
    if (!e.target.value) {
      e.target.classList.add('error');
    } else {
      e.target.classList.remove('error');
    }
  }

  const updateParams = (e) => {
    const updatedData = {...fieldsData};
    updatedData[e.target.name] = e.target.value;
    setFieldsData(updatedData)
    
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

  if (thankYouMessage) {
    return (
      <div className="success-message">
        <h2>Thank you for reaching out. We&rsquo;ll get back to you shortly.</h2>
        <p>View our <Link href="/our-work"><a>our projects</a></Link>!</p>
      </div>
    );
  } else {
    return (
    <>
      <h2>Let&rsquo;s Connect</h2>
      <form 
        id="contactForm" 
        action="?" 
        method="POST" 
        className="form" 
        onSubmit={sendEmail}
      >
        <div className="form-group half">
          <label>First Name *</label>
          <input 
            type="text" 
            name="first_name" 
            onKeyUp={(e) => updateParams(e)} 
            onBlur={(e) => validateField(e)}
            required
          />
  
        </div>
        <div className="form-group half">
          <label>Last Name *</label>
          <input 
            type="text" 
            name="last_name" 
            onKeyUp={(e) => updateParams(e)} 
            onBlur={(e) => validateField(e)}
            required
          />
        </div>
        <div className="form-group half">
          <label>Email *</label>
          <input 
            type="email" 
            name="user_email" 
            onKeyUp={(e) => updateParams(e)} 
            onBlur={(e) => validateField(e)}
            required
          />
        </div>
        <div className="form-group half">
          <label>Organization *</label>
          <input 
            type="text" 
            name="organization" 
            onKeyUp={(e) => updateParams(e)} 
            onBlur={(e) => validateField(e)}
            required
          />
        </div>
        <div className="form-group">
          <label>What are you looking for? *</label>
          <input 
            type="text" 
            name="what_looking" 
            onKeyUp={(e) => updateParams(e)} 
            onBlur={(e) => validateField(e)}
            required
          />
        </div>
        <div className="form-group">
          <label>Message</label>
          <textarea name="message" onKeyUp={(e) => updateParams(e)} />
        </div>
        <button 
          type="submit" 
          className="submit-button"
        >Submit</button>
        <div className="error-message" style={{color: 'red'}}>
          <p>{errMessage}</p>
        </div>
      </form>
    </>
    );
  }
};

export default ContactForm;
