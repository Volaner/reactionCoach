class Form
{
	#loginPage = ''
	#loginAjaxUrl =  ''
	#usernameLabel = 'Login'
	#usernameIsinvalidLabel = 'Please enter your login'
	#passwordLabel = 'Password'
	#passwordIsinvalidLabel = 'Please enter your password'
	#usernameRegexp = /(.{3,})/
	#usernameRegexpFailMessage = 'This usernam is too short. It must contain at least 3 characters.'
	#emailRegexp = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/
	#emailRegexpFailMessage = 'Enter a valid email address.'
	#passwordRegexp = /((?=.*\d)(?=.*\D).{8,})/
	#passwordRegexpFailMessage = 'Password must contain at least 8 characters and include letters and numbers.'
	#signupBtnClicked = 0
	#resetBtnClicked = 0
	#resetConfirmBtnClicked = 0
	#changePasswordBtnClicked = 0

	constructor(urls)
	{
		this.#loginAjaxUrl = urls.loginAjax;
		this.#loginPage = urls.loginPage;

		let self = this;
		let btns_signin_sample = document.querySelectorAll('button.sign_in_sample');
		if(btns_signin_sample != null)
		{
	    	for (let btn of btns_signin_sample)
	    	{
	    		btn.addEventListener("click", function()
				{
		    		self.#pressSigninSampleBtn(btn);
		    	});
	    	}
    	}

    	let btns_signin = document.querySelectorAll('button.sign_in');
		if(btns_signin != null)
		{
	    	for (let btn of btns_signin)
	    	{
	    		let inputs = [];
	    		for (let elem of btn.closest('form').getElementsByTagName('input'))
				{
					if(elem instanceof HTMLInputElement)
					{
						elem.oninput = () =>
						{
							this.#validateInput(elem)
						}

						inputs[elem.name] = elem;
					}
				}

	    		btn.addEventListener("click", function()
				{
		    		self.#pressSigninBtn(btn, inputs);
		    	});

		    	this.#checkRedirect(btn, inputs);
	    	}
    	}

    	// Reseting password
    	let btns_reset_password = document.querySelectorAll('button.reset_password');

		if(btns_reset_password != null)
		{
			for (let btn of btns_reset_password)
	    	{
	    		btn.addEventListener("click", function()
				{
		    		self.#pressResetBtn(btn);
		    	});

	    		for (let input of btn.closest('form').getElementsByTagName('input'))
	    		{
	    			if(input.name == 'email')
	    			{
	    				input.oninput = () =>
						{
							if(this.#resetBtnClicked)
							{
								this.#validateEmail(input)
							}
						}
	    			}
	    		}
	    	}
		}

		// Confirm reset password
		let btns_reset_password_confirm = document.querySelectorAll('button.reset_password_confirm');

		if(btns_reset_password_confirm != null)
		{
			for (let btn of btns_reset_password_confirm)
			{
				let password1
	    		let password2

	    		self.#checkInputsValidationOnStartup(btn)

				btn.addEventListener("click", function()
				{
		    		self.#pressResetConfirmBtn(btn);
		    	});

		    	// Bind validation inputs when user change input after first confirmResetBtn click
	    		for (let input of btn.closest('form').getElementsByTagName('input'))
				{
					if(input.name == 'new_password1')
					{
						password1 = input
					}
					else if(input.name == 'new_password2')
					{
						password2 = input
					}
				}

		    	password1.addEventListener('input', () => 
				{
					if(this.#resetConfirmBtnClicked)
					{
						this.#validateNewPassword(password1, password2)
					}
				})
				password2.addEventListener('input', () => 
				{
					if(this.#resetConfirmBtnClicked)
					{
						this.#validateNewPassword(password1, password2)
					}
				})
			}
		}

		// Change password (If user doesn't forget his password)
		let btn_change_password = document.querySelectorAll('button.change_password');

		if(btn_change_password != null)
		{
			for (let btn of btn_change_password)
			{
				let old_password
				let new_password1
	    		let new_password2

				self.#checkInputsValidationOnStartup(btn)

				btn.addEventListener("click", function()
				{
		    		self.#pressChangePasswordBtn(btn);
		    	});

		    	// Bind validation inputs when user change input after first btn_change_password click
	    		for (let input of btn.closest('form').getElementsByTagName('input'))
				{
					if(input.name == 'old_password')
					{
						old_password = input
					}
					else if(input.name == 'new_password1')
					{
						new_password1 = input
					}
					else if(input.name == 'new_password2')
					{
						new_password2 = input
					}
				}

				old_password.addEventListener('input', () => 
				{
					if(this.#changePasswordBtnClicked)
					{
						this.#validateOldPassword(old_password)
					}
				})
		    	new_password1.addEventListener('input', () => 
				{
					if(this.#changePasswordBtnClicked)
					{
						this.#validateNewPassword(new_password1, new_password2)
					}
				})
				new_password2.addEventListener('input', () => 
				{
					if(this.#changePasswordBtnClicked)
					{
						this.#validateNewPassword(new_password1, new_password2)
					}
				})
			}
		}

		// Registration
		let btns_signup = document.querySelectorAll('button.sign_up');
		if(btns_signup != null)
		{
			for (let btn of btns_signup)
	    	{
	    		let password1
	    		let password2

	    		self.#checkInputsValidationOnStartup(btn)

	    		btn.addEventListener("click", function()
				{
		    		self.#pressSignupBtn(btn);
		    	});

	    		// Bind validation inputs when user change input after first signupBtn click
	    		for (let input of btn.closest('form').getElementsByTagName('input'))
				{
		    		if(input.name == 'username')
					{
						input.addEventListener('input', () => 
						{
							if(this.#signupBtnClicked)
							{
								this.#validateUsername(input)
							}
						})
					}
					else if(input.name == 'email')
					{
						input.addEventListener('input', () => 
						{
							if(this.#signupBtnClicked)
							{
								this.#validateEmail(input)
							}
						})
					}
					else if(input.name == 'password1')
					{
						password1 = input
					}
					else if(input.name == 'password2')
					{
						password2 = input
					}
				}

		    	password1.addEventListener('input', () => 
				{
					if(this.#signupBtnClicked)
					{
						this.#validateNewPassword(password1, password2)
					}
				})
				password2.addEventListener('input', () => 
				{
					if(this.#signupBtnClicked)
					{
						this.#validateNewPassword(password1, password2)
					}
				})
	    	}
		}

		// Delete user
		let btn_delete_user = document.querySelectorAll('button.delete_user');

		if(btn_delete_user != null)
		{
			for (let btn of btn_delete_user)
			{
				btn.addEventListener("click", function()
				{
		    		self.#pressDeleteBtn(btn);
		    	});
			}
		}
	}

	#ajaxSend = async (url, formData) => {
        const response = await fetch(url, {
            method: "POST",
            body: formData
        });
        if (!response.ok)
        {
            throw new Error('HTTP error, status: ' + response.status);
        }
        else
        {
        	return await response.json();
        }
    }

    #validateInput(input)
    {
		if(input.value != '')
		{
			input.classList.remove('is-invalid');
			if(input.name == 'username')
			{
				input.nextElementSibling.textContent = this.#usernameLabel	
			}
			else if(input.name == 'password')
			{
				input.nextElementSibling.textContent = this.#passwordLabel		
			}								
		}
		else
		{
			input.classList.add('is-invalid');
			if(input.name == 'username')
			{
				input.nextElementSibling.textContent = this.#usernameIsinvalidLabel
			}
			else if(input.name == 'password')
			{
				input.nextElementSibling.textContent = this.#passwordIsinvalidLabel
			}
		}
    }

	#pressSigninSampleBtn(btn)
	{
		let formData = new FormData(btn.closest('form'));

		let username = formData.get('username');
		let password = formData.get('password');

		if(username != '' && password != '')
		{
			this.#ajaxSend(this.#loginAjaxUrl, formData)
	            .then((response) =>
	            {
	            	if(response.status == 'Done')// User authorized
	            	{
	            		window.location.reload();
	            	}
	            	else if(response.status == 'Fail')// Invalid login or password
	            	{
	            		setCookie('authorizationStatus', 'Invalid login or password');
	            		setCookie('username', username);

	            		window.location.href = this.#loginPage;
	            	}
	            })
	            .catch((err) => console.error(err))
        }
        else
        {
	        if(username == '' && password == '')
			{
				setCookie('authorizationStatus', 'username and password is empty');
			}
			else if(username == '')
			{
				setCookie('authorizationStatus', 'username is empty');
			}
			else
			{
				setCookie('authorizationStatus', 'password is empty');
				setCookie('username', username);
			}

			window.location.href = this.#loginPage;
		}
	}

	#checkRedirect(btn, inputs)
	{
		let status = getCookie('authorizationStatus');
		let username = getCookie('username');

    	if(typeof(status) == 'undefined')
    	{
    		return;
	    }
	    else
	    {
	    	deleteCookie('authorizationStatus');
	    }

    	if(status == 'username and password is empty')
    	{
    		inputs.username.classList.add('is-invalid');
    		inputs.password.classList.add('is-invalid');
    		inputs.username.nextElementSibling.textContent = this.#usernameIsinvalidLabel;
    		inputs.password.nextElementSibling.textContent = this.#passwordIsinvalidLabel;
    	}
    	else if(status == 'username is empty')
    	{
    		inputs.username.classList.add('is-invalid');
    		inputs.username.nextElementSibling.textContent = this.#usernameIsinvalidLabel;
    	}
    	else if(status == 'password is empty')
    	{
    		inputs.password.classList.add('is-invalid');
    		inputs.password.nextElementSibling.textContent = this.#passwordIsinvalidLabel;

    		if(typeof(username) != 'undefined')
    		{
    			inputs.username.value = username;
    		}
    	}
    	else if(status == 'Invalid login or password')
    	{
    		inputs.username.classList.add('is-invalid');
    		inputs.password.classList.add('is-invalid');
    		inputs.username.nextElementSibling.textContent = this.#usernameIsinvalidLabel;
    		inputs.password.nextElementSibling.textContent = this.#passwordIsinvalidLabel;

    		btn.closest('form').querySelector('div.form-error').textContent = 'Invalid login or password';

    		if(typeof(username) != 'undefined')
    		{
    			inputs.username.value = username;
    		}
    	}
    	else
    	{
    		console.log('unknown status - ' + status);
    	}
	}

	#pressSigninBtn(btn, inputs)
	{
		let form = btn.closest('form');
		let formData = new FormData(form);

		if(formData.get('username') != '' && formData.get('password') != '')
		{
			this.#ajaxSend(this.#loginAjaxUrl, formData)
	            .then((response) =>
	            {
	            	if(response.status == 'Done')// User authorized
	            	{
	            		window.location.reload();
	            	}
	            	else if(response.status == 'Fail')// Invalid login or password
	            	{
	            		form.querySelector('div.form-error').textContent = 'Login or password is invalid'
	            		inputs.username.classList.add('is-invalid');
	            		inputs.password.classList.add('is-invalid');
	            	}
	            	else
	            	{
	            		console.log(response.status);
	            	}
	            })
	            .catch((err) => console.error(err))
		}
		else
		{
			if(formData.get('username') == '')
			{
				inputs.username.classList.add('is-invalid');
				inputs.username.nextElementSibling.textContent = this.#usernameIsinvalidLabel;
			}
			if(formData.get('password') == '')
			{
				inputs.password.classList.add('is-invalid');
				inputs.password.nextElementSibling.textContent = this.#passwordIsinvalidLabel;
			}
		}
	}

	#pressResetBtn(btn)
	{
		let form = btn.closest('form')

		this.#resetBtnClicked = 1

		for (let input of form.getElementsByTagName('input'))
		{
			if(input.name == 'email')
			{
				if(this.#validateEmail(input))
				{
					form.submit()
				}
			}
		}
	}

	#pressResetConfirmBtn(btn)
	{
		let isInvalid = false
		let form = btn.closest('form')
		let password1
		let password2

		this.#resetConfirmBtnClicked = 1

		for (let input of form.getElementsByTagName('input'))
		{
			if(input.name == 'new_password1')
			{
				password1 = input
			}
			else if(input.name == 'new_password2')
			{
				password2 = input
			}
		}

		if((typeof(password1) != 'undefined' && password1 !== null) && (typeof(password2) != 'undefined' && password2 !== null))
		{
		    if(this.#validateNewPassword(password1, password2))
			{
				form.submit()
			}
		}
	}

	#pressSignupBtn(btn)
	{
		let isInvalid = false
		let form = btn.closest('form')
		let password1
		let password2

		this.#signupBtnClicked = 1

		for (let input of form.getElementsByTagName('input'))
		{
			if(input.name == 'username')
			{
				if(!this.#validateUsername(input))
				{
					isInvalid = true;
				}
			}
			else if(input.name == 'email')
			{
				if(!this.#validateEmail(input))
				{
					isInvalid = true;
				}
			}
			else if(input.name == 'password1')
			{
				password1 = input
			}
			else if(input.name == 'password2')
			{
				password2 = input
			}
		}

		if((typeof(password1) != 'undefined' && password1 !== null) && (typeof(password2) != 'undefined' && password2 !== null))
		{
		    if(!this.#validateNewPassword(password1, password2))
			{
				isInvalid = true;
			}
		}

		if(!isInvalid)
		{
			form.submit()
		}
	}

	#pressChangePasswordBtn(btn)
	{
		let isInvalid = false
		let form = btn.closest('form')
		let old_password
		let new_password1
		let new_password2

		this.#changePasswordBtnClicked = 1

		for (let input of form.getElementsByTagName('input'))
		{
			if(input.name == 'old_password')
			{
				old_password = input
			}
			else if(input.name == 'new_password1')
			{
				new_password1 = input
			}
			else if(input.name == 'new_password2')
			{
				new_password2 = input
			}
		}

		if((typeof(old_password) != 'undefined' && old_password !== null) &&
			(typeof(new_password1) != 'undefined' && new_password1 !== null) &&
			(typeof(new_password2) != 'undefined' && new_password2 !== null))
		{
			let validate_old_password = this.#validateOldPassword(old_password)
			let validate_new_password = this.#validateNewPassword(new_password1, new_password2)

		    if(validate_old_password && validate_new_password)
			{
				form.submit()
			}
		}
	}

	#pressDeleteBtn(btn)
	{
		let form = btn.closest('form')
		let input = form.querySelector('#answer')

		if(input.value == 'Delete')
		{
			input.classList.remove('is-invalid')

			form.submit()
		}
		else
		{
			input.classList.add('is-invalid')
		}
	}

	#checkInputsValidationOnStartup(btn)
	{
		for (let div of btn.closest('form').querySelectorAll('div.div-input'))
		{
			if(div.getAttribute('data-haserror') == '1')
			{
				let invalid_feedback_div = div.querySelector('div.invalid-feedback')
				let ul = invalid_feedback_div.querySelector('ul')
				let message = ul.querySelector('li').textContent

				div.querySelector('input').classList.add('is-invalid')
				ul.remove()
				invalid_feedback_div.textContent = message
			}
		}
	}

	#validateUsername(input)
	{
		let feedback_input = input.closest('div').querySelector('div.invalid-feedback')

		if(input.value == '')
		{
			feedback_input.textContent = 'This field is required.'
			input.classList.add('is-invalid')

			return false
		}
		else if(input.value.match(this.#usernameRegexp) === null)
		{
			feedback_input.textContent = this.#usernameRegexpFailMessage
			input.classList.add('is-invalid')

			return false
		}
		else
		{
			input.classList.remove('is-invalid')

			return true
		}
	}

	#validateEmail(input)
	{
		let feedback_input = input.closest('div').querySelector('div.invalid-feedback')

		if(input.value == '')
		{
			feedback_input.textContent = 'This field is required.'
			input.classList.add('is-invalid')

			return false
		}
		if(input.value.match(this.#emailRegexp) === null)
		{
			feedback_input.textContent = this.#emailRegexpFailMessage
			input.classList.add('is-invalid')

			return false
		}
		else
		{
			input.classList.remove('is-invalid')

			return true
		}
	}

	#validateNewPassword(password1, password2)
	{
		let feedback_input = password2.closest('div').querySelector('div.invalid-feedback')
		let result

		if(password1.value == '')
		{
			password1.closest('div').querySelector('div.invalid-feedback').textContent = 'This field is required.'
			password1.classList.add('is-invalid')

			result = false
		}
		else if(password1.value.match(this.#passwordRegexp) === null)
		{
			feedback_input.textContent = this.#passwordRegexpFailMessage
			password1.classList.add('is-invalid')
			password2.classList.add('is-invalid')

			result = false
		}
		else if(password2.value == '')
		{
			feedback_input.textContent = 'This field is required.'
			password2.classList.add('is-invalid')

			result = false
		}
		else if(password1.value != password2.value)
		{
			feedback_input.textContent = 'The two password fields didn’t match.';
			password1.classList.add('is-invalid');
			password2.classList.add('is-invalid');

			result = false
		}
		else
		{
			password1.classList.remove('is-invalid')
			password2.classList.remove('is-invalid')

			result = true
		}

		if(result)
		{
			return true
		}
		else
		{
			return false
		}
	}

	#validateOldPassword(password)
	{
		let feedback_input = password.closest('div').querySelector('div.invalid-feedback')

		if(password.value == '')
		{
			feedback_input.textContent = 'This field is required.'
			password.classList.add('is-invalid')

			return false
		}
		else
		{
			password.classList.remove('is-invalid')

			return true
		}
	}
}

document.addEventListener("DOMContentLoaded", function()
{
	new Form({
		'loginAjax': '/login_ajax/',
		'loginPage': '/login/'
	});
});