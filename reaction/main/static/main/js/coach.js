class Coach
{
	#button
	#info
	#running = false
	#counter = 0
	#taskCount = 5
	#timerId
	#minTimeout = 300
	#maxTimeout = 2000
	#task
	#dateBeginning
	#reaction = 0
	#btnsTask

  	init()
  	{   
    	this.#button = document.querySelector('#btnstart');
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
		}
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

  		console.log('run');
  	}

  	#stop()
  	{
  		this.#running = false;

  		this.#button.textContent = 'Run';
  		this.#button.classList.remove('btn-danger');
  		this.#button.classList.add('btn-success');
  		info.textContent = '';

  		this.#btnSetDefaultColor();
  		task.textContent = '';

		clearInterval(this.#timerId);
		clearTimeout(this.#timerId);

		this.#reaction = 0;

 		console.log('stop');
  	}

  	#pressTaskBtn(btn)
  	{
  		if(!this.#running)
  		{
  			return;
  		}

  		let my_number = btn.getAttribute('data-number');

  		if(my_number == this.#task) // Success
  		{
  			this.#reaction += new Date - this.#dateBeginning;

  			task.textContent = '';

  			this.#btnSetDefaultColor();
  			btn.classList.remove('btn-outline-dark');
  			btn.classList.add('btn-success');

  			this.#createTask();

  			this.#counter++;
  			if(this.#counter == this.#taskCount)
  			{
  				let average = Math.round(this.#reaction / this.#taskCount);

  				this.#counter = 0;
  				this.#stop();

  				info.textContent = 'Average reaction time: ' + average + 'ms';
  			}
  		}
  		else // Fail
  		{
  			this.#btnSetDefaultColor();
  			btn.classList.remove('btn-outline-dark');
  			btn.classList.add('btn-danger');
  		}
  	}

  	#createTask()
  	{
  		let timeout = this.#getRandomInt(this.#minTimeout, this.#maxTimeout);
		let self = this;

  		this.#timerId = setTimeout(function()
  		{
  			task.classList.remove('text-danger');
  			task.classList.remove('text-success');

  			self.#task = self.#getRandomInt(1, 4);
  			task.textContent = self.#task;

  			self.#dateBeginning = new Date;

  			self.#btnSetDefaultColor();
  		}, timeout);
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
}

let coach = new Coach();

document.addEventListener("DOMContentLoaded", function()
{
	coach.init();
});