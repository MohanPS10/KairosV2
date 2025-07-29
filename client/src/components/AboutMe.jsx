import React, { useState } from 'react';
import { User, ChevronDown, Mail, X } from 'lucide-react';
import '../styles/AboutMe.css';

export default function AboutMe() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [form, setForm] = useState({
    years: '',
    skills: [],
    endorsements: [],
    interests: [],
  });
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitedEmails, setInvitedEmails] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [endorsementInput, setEndorsementInput] = useState('');
  const [interestInput, setInterestInput] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      action: "aboutme",
      payload: {
        email_id: "user@example.com", // This should come from user context
        bio: form.years,
        interests: form.interests,
        skills: form.skills,
        endorsements: form.endorsements,
        invitation: invitedEmails
      }
    };

    try {
      const response = await fetch('https://a3trgqmu4k.execute-api.us-west-1.amazonaws.com/prod/invoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Success:', result);
        // TODO: Handle success (e.g., show success message, reset form, etc.)
      } else {
        console.error('Error:', response.status, response.statusText);
        // TODO: Handle error (e.g., show error message)
      }
    } catch (error) {
      console.error('Network error:', error);
      // TODO: Handle network error (e.g., show error message)
    }
  };

  const handleInviteEmailChange = (e) => {
    setInviteEmail(e.target.value);
  };

  const handleInviteEmailKeyPress = (e) => {
    if (e.key === 'Enter' && inviteEmail.trim()) {
      e.preventDefault();
      const email = inviteEmail.trim();
      if (isValidEmail(email) && !invitedEmails.includes(email)) {
        setInvitedEmails([...invitedEmails, email]);
        setInviteEmail('');
      }
    }
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const handleEndorsementKeyPress = (e) => {
    if (e.key === 'Enter' && endorsementInput.trim()) {
      e.preventDefault();
      addEndorsement(endorsementInput);
    }
  };

  const handleInterestKeyPress = (e) => {
    if (e.key === 'Enter' && interestInput.trim()) {
      e.preventDefault();
      addInterest(interestInput);
    }
  };

  const removeInvitedEmail = (emailToRemove) => {
    setInvitedEmails(invitedEmails.filter(email => email !== emailToRemove));
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Helper functions for tile management
  const addSkill = (skill) => {
    if (skill.trim() && !form.skills.includes(skill.trim())) {
      setForm({ ...form, skills: [...form.skills, skill.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setForm({ ...form, skills: form.skills.filter(skill => skill !== skillToRemove) });
  };

  const addEndorsement = (endorsement) => {
    if (endorsement.trim() && !form.endorsements.includes(endorsement.trim())) {
      setForm({ ...form, endorsements: [...form.endorsements, endorsement.trim()] });
      setEndorsementInput('');
    }
  };

  const removeEndorsement = (endorsementToRemove) => {
    setForm({ ...form, endorsements: form.endorsements.filter(endorsement => endorsement !== endorsementToRemove) });
  };

  const addInterest = (interest) => {
    if (interest.trim() && !form.interests.includes(interest.trim())) {
      setForm({ ...form, interests: [...form.interests, interest.trim()] });
      setInterestInput('');
    }
  };

  const removeInterest = (interestToRemove) => {
    setForm({ ...form, interests: form.interests.filter(interest => interest !== interestToRemove) });
  };

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (invitedEmails.length > 0) {
      // TODO: handle invitation submission logic
      console.log('Inviting emails:', invitedEmails);
      setInvitedEmails([]);
    }
  };

  return (
    <div className="aboutme-card-outer">
      <div className="aboutme-card-inner">
        <div className="aboutme-header-row" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="aboutme-header-icon"><User /></div>
          <div className="aboutme-header-texts">
            <div className="aboutme-title">About Me</div>
            <div className="aboutme-subtitle">Tell us about yourself</div>
          </div>
          <ChevronDown className={`aboutme-chevron ${isExpanded ? 'aboutme-chevron-rotated' : ''}`} />
        </div>
        {isExpanded && (
          <>
            <form className="aboutme-form" onSubmit={handleSubmit}>
              <label className="aboutme-form-label">
                What have you been doing over the past several years?
                <input
                  type="text"
                  name="years"
                  className="aboutme-form-input"
                  value={form.years}
                  onChange={handleChange}
                  placeholder="Enter your answer"
                  autoComplete="off"
                />
              </label>
              
              <label className="aboutme-form-label">
                What are your interests?
                <div className="aboutme-invite-input-wrapper">
                  {form.interests.map((interest, index) => (
                    <div key={index} className="aboutme-email-tile">
                      <span className="aboutme-email-text">{interest}</span>
                      <button
                        type="button"
                        className="aboutme-email-remove"
                        onClick={() => removeInterest(interest)}
                      >
                        <X className="aboutme-email-remove-icon" />
                      </button>
                    </div>
                  ))}
                  <input
                    type="text"
                    className="aboutme-invite-input"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    onKeyPress={handleInterestKeyPress}
                    placeholder={form.interests.length === 0 ? "Enter your interests" : ""}
                    autoComplete="off"
                  />
                </div>
              </label>
              
              <label className="aboutme-form-label">
                What skills have you acquired?
                <div className="aboutme-invite-input-wrapper">
                  {form.skills.map((skill, index) => (
                    <div key={index} className="aboutme-email-tile">
                      <span className="aboutme-email-text">{skill}</span>
                      <button
                        type="button"
                        className="aboutme-email-remove"
                        onClick={() => removeSkill(skill)}
                      >
                        <X className="aboutme-email-remove-icon" />
                      </button>
                    </div>
                  ))}
                  <input
                    type="text"
                    className="aboutme-invite-input"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={handleSkillKeyPress}
                    placeholder={form.skills.length === 0 ? "Enter your skills" : ""}
                    autoComplete="off"
                  />
                </div>
              </label>
              
              <label className="aboutme-form-label">
                Do you have any special "endorsements"?
                <div className="aboutme-invite-input-wrapper">
                  {form.endorsements.map((endorsement, index) => (
                    <div key={index} className="aboutme-email-tile">
                      <span className="aboutme-email-text">{endorsement}</span>
                      <button
                        type="button"
                        className="aboutme-email-remove"
                        onClick={() => removeEndorsement(endorsement)}
                      >
                        <X className="aboutme-email-remove-icon" />
                      </button>
                    </div>
                  ))}
                  <input
                    type="text"
                    className="aboutme-invite-input"
                    value={endorsementInput}
                    onChange={(e) => setEndorsementInput(e.target.value)}
                    onKeyPress={handleEndorsementKeyPress}
                    placeholder={form.endorsements.length === 0 ? "Enter your endorsements" : ""}
                    autoComplete="off"
                  />
                </div>
              </label>
              
              {/* Invite Others Section */}
              <div className="aboutme-invite-section">
                <div className="aboutme-invite-header">
                  <Mail className="aboutme-invite-icon" />
                  <div className="aboutme-invite-texts">
                    <div className="aboutme-invite-title">Invite others?</div>
                    <div className="aboutme-invite-subtitle">Invite outside organizational individuals to upload resume/credential information</div>
                  </div>
                </div>
                
                <div className="aboutme-invite-container">
                  <div className="aboutme-invite-input-wrapper">
                    {invitedEmails.map((email, index) => (
                      <div key={index} className="aboutme-email-tile">
                        <span className="aboutme-email-text">{email}</span>
                        <button
                          type="button"
                          className="aboutme-email-remove"
                          onClick={() => removeInvitedEmail(email)}
                        >
                          <X className="aboutme-email-remove-icon" />
                        </button>
                      </div>
                    ))}
                    <input
                      type="email"
                      className="aboutme-invite-input"
                      value={inviteEmail}
                      onChange={handleInviteEmailChange}
                      onKeyPress={handleInviteEmailKeyPress}
                      placeholder={invitedEmails.length === 0 ? "Enter email address" : ""}
                      autoComplete="off"
                    />
                  </div>
                  

                </div>
              </div>
              
              <button type="submit" className="aboutme-form-submit">
                <svg className="aboutme-form-submit-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L21 12 10.5 4.5v5.25L3 9.75v4.5l7.5 0v5.25z" />
                </svg>
                Submit
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
} 