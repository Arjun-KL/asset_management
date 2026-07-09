(function () {
  function shellSteps() {
    return [
      {
        element: '.sidebar-brand',
        popover: {
          title: 'Welcome to KT Telematic Asset Management',
          description: 'Track every laptop, phone, and tool your company owns — from purchase to scrap.',
          side: 'right',
        },
      },
      {
        element: '.sidebar-nav',
        popover: {
          title: 'Navigate here',
          description: 'Overview, Masters (Employees, Assets, Categories), and Transactions (Issue, Return, Scrap) are all grouped in this sidebar.',
          side: 'right',
        },
      },
      {
        element: '.sidebar-toggle',
        popover: {
          title: 'Need more room?',
          description: 'Collapse the sidebar to an icon-only strip. Your choice is remembered next time you visit.',
          side: 'right',
        },
      },
      {
        element: '.topbar-greeting',
        popover: {
          title: 'That’s you',
          description: 'A quick greeting every time you sign in, so you always know you’re logged in as the right user.',
          side: 'bottom',
        },
      },
      {
        element: '.user-menu-toggle',
        popover: {
          title: 'Your account',
          description: 'Log out from here when you’re done.',
          side: 'bottom',
        },
      },
    ];
  }

  function pageSteps() {
    const steps = [];
    const path = window.location.pathname;

    if (document.querySelector('.page-header')) {
      steps.push({
        element: '.page-header',
        popover: {
          title: 'Page overview',
          description: 'Every page starts with a short summary and its main action, right where you’d expect it.',
          side: 'bottom',
        },
      });
    }

    if (document.querySelector('.detail-actions')) {
      steps.push({
        element: '.detail-actions',
        popover: {
          title: 'Available actions',
          description: 'These change based on the asset’s current status — Issue only shows when it’s in stock, Return only when it’s issued, and so on.',
          side: 'bottom',
        },
      });
    }

    if (document.querySelector('.filter-pills')) {
      steps.push({
        element: '.filter-pills',
        popover: {
          title: 'Quick filters',
          description: 'Narrow the list instantly — no page reload.',
          side: 'bottom',
        },
      });
    }

    if (document.querySelector('.stat-card')) {
      steps.push({
        element: '.stat-card',
        popover: {
          title: 'At-a-glance totals',
          description: 'Key numbers for what’s ready to issue right now.',
          side: 'bottom',
        },
      });
    }

    if (document.querySelector('.photo-upload')) {
      steps.push({
        element: '.photo-upload',
        popover: {
          title: 'Attach a photo',
          description: 'Optional, but handy for identifying assets at a glance later. JPEG, PNG, WEBP, or GIF up to 5MB.',
          side: 'bottom',
        },
      });
    }

    if (document.querySelector('.timeline')) {
      steps.push({
        element: '.timeline',
        popover: {
          title: 'Full asset lifecycle',
          description: 'Every purchase, issue, return, and scrap event for this asset, in order.',
          side: 'top',
        },
      });
    }

    if (['/issue-asset', '/return-asset', '/scrap-asset'].includes(path)) {
      const firstSelect = document.querySelector('form select');
      if (firstSelect) {
        steps.push({
          element: firstSelect,
          popover: {
            title: 'Pick an asset',
            description: 'Only assets eligible for this action are listed here.',
            side: 'bottom',
          },
        });
      }
    }

    if (document.querySelector('.table-surface table')) {
      steps.push({
        element: '.table-surface',
        popover: {
          title: 'Searchable, sortable tables',
          description: 'Every list in the app supports search, column sorting, and pagination out of the box.',
          side: 'top',
        },
      });
    }

    steps.push({
      element: '.tour-btn',
      popover: {
        title: 'Come back anytime',
        description: 'Click "Take a tour" on any page for a walkthrough of what that page can do.',
        side: 'bottom',
      },
    });

    return steps;
  }

  function startTour() {
    if (!window.driver || !window.driver.js) return;
    const alreadySeenShell = localStorage.getItem('kt_am_tour_seen') === '1';
    const steps = alreadySeenShell ? pageSteps() : shellSteps().concat(pageSteps());
    if (!steps.length) return;

    const driverObj = window.driver.js.driver({
      showProgress: true,
      popoverClass: 'brand-tour',
      steps,
    });
    driverObj.drive();
    localStorage.setItem('kt_am_tour_seen', '1');
  }

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('startTourBtn');
    if (btn) {
      btn.addEventListener('click', startTour);
    }

    if (localStorage.getItem('kt_am_tour_seen') !== '1') {
      setTimeout(startTour, 400);
    }
  });
})();
