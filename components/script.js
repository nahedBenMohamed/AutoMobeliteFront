const handleMenuClick = () => {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('hide');
    }
};

const handleSearchButtonClick = (e) => {
    e.preventDefault();
    const searchForm = document.querySelector('#content nav form');
    if (searchForm) {
        searchForm.classList.toggle('show');
        const searchButtonIcon = document.querySelector('#content nav form button .bx');
        if (searchButtonIcon) {
            searchButtonIcon.classList.toggle('bx-search');
            searchButtonIcon.classList.toggle('bx-x');
        }
    }
};

const handleResize = () => {
    const sidebar = document.getElementById('sidebar');
    const searchForm = document.querySelector('#content nav form');
    const searchButtonIcon = document.querySelector('#content nav form button .bx');
    if (sidebar && searchForm && searchButtonIcon) {
        if (window.innerWidth < 768) {
            sidebar.classList.add('hide');
        } else if (window.innerWidth > 576) {
            searchForm.classList.remove('show');
            searchButtonIcon.classList.remove('bx-x');
            searchButtonIcon.classList.add('bx-search');
        }
    }
};

const handleSwitchModeChange = (event) => {
    const body = document.body;
    if (body) {
        if (event.target.checked) {
            body.classList.add('dark');
        } else {
            body.classList.remove('dark');
        }
    }
};

export const initializeSidebar = () => {
    const menuBar = document.querySelector('#content nav .bx.bx-menu');
    const searchButton = document.querySelector('#content nav form button');
    const switchMode = document.getElementById('switch-mode');

    if (menuBar) {
        menuBar.addEventListener('click', handleMenuClick);
    }


    if (switchMode) {
        switchMode.addEventListener('change', handleSwitchModeChange);
    }

    handleResize();
    window.addEventListener('resize', handleResize);
};

export default initializeSidebar;
