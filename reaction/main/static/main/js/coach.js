class Coach
{
	#button
	#running = false
	#counter = 0
	#taskCount = 10
	#timerId
	#minTimeout = 300
	#maxTimeout = 2000
	#task
	#dateBeginning
	#reaction = 0
	#btnsTask
	#btn_1
	#btn_2
	#btn_3
	#btn_4
	#hasTask = false
	#ResultSendUrl = '/result_send/'

  	constructor()
  	{   
    	this.#button = document.querySelector('#btnstart');
  		if(this.#button == null){ return }
  		let self = this;

    	this.#button.addEventListener("click", function()
    	{
    		self.pressStartBtn();
    	});

    	this.#btnsTask = document.querySelectorAll('.btn_task');
    	for (let btn of this.#btnsTask)
    	{
			btn.addEventListener("click", function()
			{
	    		self.#pressTaskBtn(btn);
	    	});

	    	let key_number = btn.getAttribute('data-number');
	    	if(key_number == 1)
	    	{
	    		this.#btn_1 = btn;
	    	}
	    	else if(key_number == 2)
	    	{
	    		this.#btn_2 = btn;
	    	}
	    	else if(key_number == 3)
	    	{
	    		this.#btn_3 = btn;
	    	}
	    	else if(key_number == 4)
	    	{
	    		this.#btn_4 = btn;
	    	}
		}

		document.addEventListener('keydown', function(event)
		{
			if(!self.#hasTask || (keyboardSwitch.type == 'checkbox' && !keyboardSwitch.checked))
			{
				return;
			}

			if (event.code == 'Digit1')
			{
		    	self.#checkTask(1);
		  	}
		  	else if (event.code == 'Digit2')
			{
		    	self.#checkTask(2);
		  	}
		  	else if (event.code == 'Digit3')
			{
		    	self.#checkTask(3);
		  	}
		  	else if (event.code == 'Digit4')
			{
		    	self.#checkTask(4);
		  	}
		});
  	}

  	pressStartBtn()
  	{
  		if(!this.#running) // Run
  		{
  			this.#run();
  		}
  		else // Stop
  		{
  			this.#stop();
  		}
  	}

  	#run()
  	{
  		this.#running = true;

  		this.#button.textContent = 'Stop';
  		this.#button.classList.remove('btn-success');
  		this.#button.classList.add('btn-danger');

  		info.textContent = '3';

  		let counter = 2;
  		let self = this;
  		this.#timerId = setInterval(function()
  		{
  			if(counter == 0)
  			{
  				info.textContent = 'Go!';
  				clearInterval(self.#timerId);
  				self.#createTask();
  			}
  			else
  			{
	  			info.textContent = counter;
	  			counter--;
  			}
  		}, 1000);
  	}

  	#stop()
  	{
  		this.#running = false;
  		this.#hasTask = false;

  		this.#button.textContent = 'Run';
  		this.#button.classList.remove('btn-danger');
  		this.#button.classList.add('btn-success');
  		info.innerHTML = '&nbsp;';

  		this.#btnSetDefaultColor();
  		task.textContent = '';

		clearInterval(this.#timerId);
		clearTimeout(this.#timerId);

		this.#reaction = 0;
  	}

  	#pressTaskBtn(btn)
  	{
  		if(!this.#hasTask)
  		{
  			return;
  		}

  		let key_number = btn.getAttribute('data-number');

  		this.#checkTask(key_number);
  	}

  	#createTask()
  	{
  		let timeout = this.#getRandomInt(this.#minTimeout, this.#maxTimeout);
		let self = this;

  		this.#timerId = setTimeout(function()
  		{
  			self.#hasTask = true;

  			task.classList.remove('text-danger');
  			task.classList.remove('text-success');

  			self.#task = self.#getRandomInt(1, 4);
  			task.textContent = self.#task;

  			self.#dateBeginning = new Date;

  			self.#btnSetDefaultColor();
  		}, timeout);
  	}

  	#checkTask(key_number)
  	{
  		if(key_number == this.#task) // Success
  		{
  			this.#hasTask = false;
  			this.#reaction += new Date - this.#dateBeginning;

  			task.textContent = '';

  			this.#btnSetDefaultColor();
  			if(key_number == 1)
  			{
  				this.#btn_1.classList.remove('btn-outline-dark');
  				this.#btn_1.classList.add('btn-success');
  			}
  			else if(key_number == 2)
  			{
  				this.#btn_2.classList.remove('btn-outline-dark');
  				this.#btn_2.classList.add('btn-success');
  			}
  			else if(key_number == 3)
  			{
  				this.#btn_3.classList.remove('btn-outline-dark');
  				this.#btn_3.classList.add('btn-success');
  			}
  			else if(key_number == 4)
  			{
  				this.#btn_4.classList.remove('btn-outline-dark');
  				this.#btn_4.classList.add('btn-success');
  			}

  			this.#counter++;
  			if(this.#counter == this.#taskCount)
  			{
  				let average = Math.round(this.#reaction / this.#taskCount)/1000;
  				let checkbox = document.getElementById('keyboardSwitch');
  				let enable_keyboard = (checkbox.checked) ? 1 : 0;

  				this.#counter = 0;
  				this.#stop();

  				info.textContent = 'Average reaction time: ' + average + 'ms';

  				let data = JSON.stringify({
		    		time: average,
		    		enable_keyboard: enable_keyboard
		    	});

    			this.#ajaxSend(this.#ResultSendUrl, data)
		            .then((response) =>
		            {
		            	console.log('coach.js - ' + response.message)
		            })
			        .catch((err) => console.error(err))
		  			}
  			else
  			{
	  			this.#createTask();
  			}
  		}
  		else // Fail
  		{
  			this.#btnSetDefaultColor();
  			if(key_number == 1)
  			{
  				this.#btn_1.classList.remove('btn-outline-dark');
  				this.#btn_1.classList.add('btn-danger');
  			}
  			else if(key_number == 2)
  			{
  				this.#btn_2.classList.remove('btn-outline-dark');
  				this.#btn_2.classList.add('btn-danger');
  			}
  			else if(key_number == 3)
  			{
  				this.#btn_3.classList.remove('btn-outline-dark');
  				this.#btn_3.classList.add('btn-danger');
  			}
  			else if(key_number == 4)
  			{
  				this.#btn_4.classList.remove('btn-outline-dark');
  				this.#btn_4.classList.add('btn-danger');
  			}
  		}
  	}

  	#getRandomInt(min, max)
  	{
  		return Math.floor(Math.random() * (max - min + 1) + min);
  	}

  	#btnSetDefaultColor()
  	{
    	for (let btn of this.#btnsTask)
    	{
			btn.classList.remove('btn-danger');
			btn.classList.remove('btn-success');
			btn.classList.add('btn-outline-dark');
		}
  	}

  	#ajaxSend = async (url, data) => {
        const response = await fetch(url, {
            method: "POST",
            headers: {'X-CSRFToken': getCookie('csrftoken')},
            body: data
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
}


document.addEventListener("DOMContentLoaded", function()
{
	new Coach();
});