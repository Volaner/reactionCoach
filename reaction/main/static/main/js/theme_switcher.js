class ThemeSwitcher
{
	#switcher
	#links
	#preferredTheme
	#iconDiv

	constructor(selector)
  	{
  		this.#switcher = document.querySelector(selector)
  		if(!this.#switcher)
  		{
  			return
  		}
  		this.#links = this.#switcher.querySelectorAll('a')
  		this.#preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  		this.#iconDiv = this.#switcher.parentElement.querySelector('a')

  		this.#applyTheme()

  		for (let toggle of this.#links)
  		{
	        toggle.addEventListener('click', event =>
	        {
	        	event.preventDefault()

		        let theme = toggle.getAttribute('data-bs-theme-value')

		        localStorage.setItem('theme', theme)
		        this.#applyTheme()
	        })
	    }
  	}

  	#applyTheme()
  	{
  		let theme = localStorage.getItem('theme')

  		if(theme == 'light' || theme == 'dark')
  		{
  			document.documentElement.setAttribute('data-bs-theme', theme)
  		}
  		else
  		{
  			document.documentElement.setAttribute('data-bs-theme', this.#preferredTheme)
  		}

		this.#setIcon(theme)
  	}

  	#setIcon(theme)
  	{
  		for(let link of this.#links)
  		{
  			link.classList.remove('active')

  			if(link.getAttribute('data-bs-theme-value') == theme)
  			{
  				link.classList.add('active')

		  		this.#iconDiv.querySelector('i').remove()

		  		this.#iconDiv.appendChild(link.querySelector('i').cloneNode())
  			}
  		}
  	}
}

document.addEventListener("DOMContentLoaded", function()
{
	new ThemeSwitcher('#theme-switcher')
});