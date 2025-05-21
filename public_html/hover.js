//for each element with the hover class, apply stylings for mouse enter and mouse leave events
document.querySelectorAll('.hover').forEach(element => {
    element.addEventListener('mouseenter', () => {
        element.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        element.style.transform = 'scale(1.05)';
        element.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
    });
    
    element.addEventListener('mouseleave', () => {
        element.style.transform = 'scale(1)';
        element.style.boxShadow = 'none';
    });
});