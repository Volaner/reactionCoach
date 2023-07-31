class Form
{
	#loginPage = ''
	#loginAjaxUrl =  ''
	#usernameLabel = 'Login'
	#usernameIsinvalidLabel = 'Please enter your login'
	#passwordLabel = 'Password'
	#passwordIsinvalidLabel = 'Please enter your password'

	constructor(urls)
	{
		this.#loginAjaxUrl = urls.loginAjax;
		this.#loginPage = urls.loginPage;

		let self = this;
		let btn_signin_sample = document.querySelectorAll('button.sign_in_sample');
		if(btn_signin_sample != null)
		{
	    	for (let btn of btn_signin_sample)
	    	{
	    		btn.addEventListener("click", function()
				{
		    		self.#pressSigninSampleBtn(btn);
		    	});
	    	}
    	}

    	let btn_signin = document.querySelectorAll('button.sign_in');
		if(btn_signin != null)
		{
	    	for (let btn of btn_signin)
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


    	let reset_password = document.querySelectorAll('button.reset_password');
		if(reset_password != null)
		{
			for (let btn of reset_password)
	    	{
	    		for (let elem of btn.closest('form').getElementsByTagName('input'))
	    		{
	    			if(elem instanceof HTMLInputElement)
	    			{
	    				elem.oninput = () =>
						{
							this.#validateInput(elem)
						}
	    			}
	    		}

	    		btn.addEventListener("click", function()
				{
		    		self.#pressResetBtn(btn, inputs);
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
			}

			window.location.href = this.#loginPage;
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
		console.log(btn)
	}

	#checkRedirect(btn, inputs)
	{
		let status = getCookie('authorizationStatus');

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
    	}
    	else if(status == 'Invalid login or password')
    	{
    		inputs.username.classList.add('is-invalid');
    		inputs.password.classList.add('is-invalid');
    		inputs.username.nextElementSibling.textContent = this.#usernameIsinvalidLabel;
    		inputs.password.nextElementSibling.textContent = this.#passwordIsinvalidLabel;

    		btn.closest('form').querySelector('div.form-error').textContent = 'Invalid login or password';
    	}
    	else
    	{
    		console.log('unknown status - ' + status);
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