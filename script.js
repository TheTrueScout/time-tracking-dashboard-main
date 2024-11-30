


class TimeTrackingApp {
  constructor() {

      this.sortButtons = document.querySelectorAll('.sort-button');
      this.timeCategories = ['work', 'play', 'study', 'exercise', 'social', 'self-care'];

      this.sortButtonsEventListeners();
    }

    sortButtonsEventListeners() {
      this.sortButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const currentActive = document.querySelector('.sort-button.sort-active');
          if (currentActive) {
            currentActive.classList.remove('sort-active')
          }
          button.classList.add('sort-active')
          this.fetchData();
        })
      });
    }

    async fetchData() {
      try {
        const response = await fetch('./data.json')
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const data = await response.json();
        const activeTimeFrame = this.getActiveTimeFrame();
        this.updateData(data, activeTimeFrame);
      }
      catch (error) {
        console.error('Error', error.message)
      }
    }

    getActiveTimeFrame() {
      const currentActive = document.querySelector('.sort-button.sort-active');
      return currentActive.dataset.sort;
    }

    updateData(data, activeTimeFrame) {
    this.timeCategories.forEach((category) => {
      const categoryData = data.find(item => 
        item.title.toLowerCase() === category
      );

      if (categoryData) {
        const currentHoursEl = document.querySelector(`[data-now=${category}]`);
        const previousHoursEl = document.querySelector(`[data-previous=${category}]`);

        if (currentHoursEl && previousHoursEl) {
          const currentHours = categoryData.timeframes[activeTimeFrame].current;
          const previousHours = categoryData.timeframes[activeTimeFrame].previous;
        
          currentHoursEl.textContent = `${currentHours}hrs`
          
          const timeFrameText = {
            'daily': 'Yesterday',
            'weekly': 'Last Week',
            'monthly': 'Last Month'
          }[activeTimeFrame]

          previousHoursEl.textContent = `${timeFrameText} - ${previousHours}hrs`
        }
      }
    })

  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new TimeTrackingApp();
  app.fetchData(); // Initial data load
});