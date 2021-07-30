window ['addEventListener'] ('load', Global => {
    const Download = document ['querySelector'] ('#Download');
    Download ['addEventListener'] ('click', Event => {
        alert (Event.target);
    });
});
