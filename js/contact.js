(() => {
    // Array to hold fields touched
    const touched = [];

    // Validate contact form
    const validateContact = (e) => {
        const {name, email, subject} = document.getElementsByTagName("input");
        const message = document.getElementById("message");
        const {nameError, emailError, subjectError, messageError} = document.getElementsByClassName("error");

        const emailRegex = new RegExp(/^[A-Za-z0-9][a-zA-Z0-9._-]{1,}@[a-zA-Z0-9-]{2,}\.[a-zA-Z0-9.-]{2,}$/);
        let errorCount = 0;

        const errors = {
            name: {
                error: name.value.length < 1,
                field: nameError,
                input: name
            },
            email: {
                error: !emailRegex.test(email.value),
                field: emailError,
                input: email
            },
            subject: {
                error: subject.value.length < 1,
                field: subjectError,
                input: subject
            },
            message: {
                error: message.value.length < 1,
                field: messageError,
                input: message
            }
        };

        // Check if there are any errors and toggle error messages
        for (let key in errors) {
            if (errors.hasOwnProperty(key)) {
                if(!touched.includes(key) && e.target.id !== "contactSubmit") {
                    errorCount++;
                    continue;
                }

                if (errors[key].error) {
                    errors[key].field.style.display = "block";
                    errors[key].input.classList.add("inputError");

                    if(!touched.includes(e.target.id)) {
                        touched.push(e.target.id);
                    }

                    errorCount++;
                } else {
                    errors[key].input.classList.remove("inputError");
                    errors[key].field.style.display = "none";
                }
            }
        }

        // All fields ok, ready to submit
        if (errorCount === 0 && e.target.id === "contactSubmit") {
            document.getElementById("contactConfirmMessage").style.display = "flex";

            name.value = "";
            email.value = "";
            subject.value = "";
            message.value = "";
        }
    };

    // Event listener for modal confirm button
    document.getElementById("contactConfirmMessageConfirm").addEventListener("click", () => {
        document.getElementById("contactConfirmMessage").style.display = "none";
    }, false);

    // Setup event listener for the contactSubmit button
    const submitContact = document.getElementById("contactSubmit");
    submitContact.addEventListener("click", validateContact, false);

    // Setup input event listeners
    const inputFields = ["name", "email", "subject", "message"];
    for(let i = 0; i < inputFields.length; i++) {
        document.getElementById(inputFields[i]).addEventListener("keyup", (e) => validateContact(e), false);
        document.getElementById(inputFields[i]).addEventListener("blur", (e) => {
            if(!touched.includes(e.target.id)) {
                touched.push(e.target.id);
            }
            validateContact(e)
        }, false);
    }
})();