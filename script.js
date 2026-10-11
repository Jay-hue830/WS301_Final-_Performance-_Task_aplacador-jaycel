const form = document.getElementById("registrationForm");
const successMessage = document.getElementById("successMessage");
const togglePasswordButton = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const submitButton = document.getElementById("submitButton");

const fields = {
    studentId: document.getElementById("studentId"),
    fullName: document.getElementById("fullName"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    dob: document.getElementById("dob"),
    program: document.getElementById("program"),
    yearLevel: document.getElementById("yearLevel"),
    password: passwordInput,
    confirmPassword: confirmPasswordInput,
    address: document.getElementById("address")
};

const errorMessages = {
    studentId: document.getElementById("studentIdError"),
    fullName: document.getElementById("fullNameError"),
    email: document.getElementById("emailError"),
    phone: document.getElementById("phoneError"),
    dob: document.getElementById("dobError"),
    gender: document.getElementById("genderError"),
    program: document.getElementById("programError"),
    yearLevel: document.getElementById("yearLevelError"),
    password: document.getElementById("passwordError"),
    confirmPassword: document.getElementById("confirmPasswordError"),
    address: document.getElementById("addressError"),
    agreement: document.getElementById("agreementError")
};

function showError(field, message, errorElement) {
    field.classList.add("error");
    errorElement.textContent = message;
}

function clearError(field, errorElement) {
    field.classList.remove("error");
    errorElement.textContent = "";
}

function getTrimmedValue(field) {
    const cleanValue = field.value.trim();
    field.value = cleanValue;
    return cleanValue;
}

function validateField(fieldName) {
    const field = fields[fieldName];
    const value = getTrimmedValue(field);
    const errorElement = errorMessages[fieldName];
    const label = field.dataset.label;

    if (value === "") {
        showError(field, `${label} is required.`, errorElement);
        return false;
    }

    if (fieldName === "email") {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailPattern.test(value)) {
            showError(field, "Please enter a valid email address.", errorElement);
            return false;
        }
    }

    if (fieldName === "phone") {
        const phonePattern = /^09\d{9}$/;
        if (!phonePattern.test(value)) {
            showError(field, `Enter a valid ${field.dataset.format}.`, errorElement);
            return false;
        }
    }

    if (fieldName === "dob") {
        const selectedDate = new Date(`${value}T00:00:00`);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (Number.isNaN(selectedDate.getTime()) || selectedDate >= today) {
            showError(field, "Date of birth must be earlier than today.", errorElement);
            return false;
        }
    }

    if (fieldName === "password" && value.length < 8) {
        showError(field, "Password must contain at least 8 characters.", errorElement);
        return false;
    }

    if (fieldName === "confirmPassword" && value !== passwordInput.value.trim()) {
        showError(field, "Passwords do not match.", errorElement);
        return false;
    }

    clearError(field, errorElement);
    return true;
}

function validateGender() {
    const selectedGender = document.querySelector('input[name="gender"]:checked');
    const genderFieldset = document.querySelector(".gender-field");

    if (!selectedGender) {
        genderFieldset.classList.add("error-group");
        errorMessages.gender.textContent = "Please select a gender option.";
        return false;
    }

    genderFieldset.classList.remove("error-group");
    errorMessages.gender.textContent = "";
    return true;
}

function validateAgreement() {
    const agreement = document.getElementById("agreement");

    if (!agreement.checked) {
        errorMessages.agreement.textContent = "You must confirm the information before submitting.";
        agreement.classList.add("error");
        return false;
    }

    errorMessages.agreement.textContent = "";
    agreement.classList.remove("error");
    return true;
}

function validateSelect(fieldName) {
    const field = fields[fieldName];
    const errorElement = errorMessages[fieldName];

    if (field.value.trim() === "") {
        showError(field, `Please select a ${field.dataset.label.toLowerCase()}.`, errorElement);
        return false;
    }

    clearError(field, errorElement);
    return true;
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    let isFormValid = true;

    Object.keys(fields).forEach(function(fieldName) {
        if (!validateField(fieldName)) {
            isFormValid = false;
        }
    });

    if (!validateSelect("program")) {
        isFormValid = false;
    }

    if (!validateSelect("yearLevel")) {
        isFormValid = false;
    }

    if (!validateGender()) {
        isFormValid = false;
    }

    if (!validateAgreement()) {
        isFormValid = false;
    }

    if (!isFormValid) {
        successMessage.hidden = true;
        successMessage.textContent = "";
        const firstInvalidField = form.querySelector(".error, .error-group");
        if (firstInvalidField) {
            firstInvalidField.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
    }

    successMessage.textContent = `Registration successful! Welcome, ${fields.fullName.value}. Your information passed validation.`;
    successMessage.hidden = false;

    form.querySelectorAll(".error").forEach(function(element) {
        element.classList.remove("error");
    });
    form.querySelectorAll(".error-group").forEach(function(element) {
        element.classList.remove("error-group");
    });
    Object.values(errorMessages).forEach(function(element) {
        element.textContent = "";
    });

    successMessage.scrollIntoView({ behavior: "smooth", block: "center" });
});

togglePasswordButton.addEventListener("click", function() {
    const shouldShow = passwordInput.type === "password";

    passwordInput.setAttribute("type", shouldShow ? "text" : "password");
    confirmPasswordInput.setAttribute("type", shouldShow ? "text" : "password");

    togglePasswordButton.classList.toggle("password-visible", shouldShow);
    togglePasswordButton.dataset.state = shouldShow ? "visible" : "hidden";
    togglePasswordButton.setAttribute("aria-pressed", String(shouldShow));
    togglePasswordButton.textContent = shouldShow ? "Hide passwords" : "Show passwords";
});

form.addEventListener("input", function(event) {
    const target = event.target;

    if (target.name === "gender") {
        validateGender();
        return;
    }

    if (target.id === "agreement") {
        validateAgreement();
        return;
    }

    if (target.id in fields) {
        validateField(target.id);
        if (target.id === "password" && confirmPasswordInput.value.trim() !== "") {
            validateField("confirmPassword");
        }
        if (target.id === "confirmPassword") {
            validateField("confirmPassword");
        }
    }
});

form.addEventListener("change", function(event) {
    const target = event.target;

    if (target.id === "program" || target.id === "yearLevel") {
        validateSelect(target.id);
    } else if (target.name === "gender") {
        validateGender();
    } else if (target.id === "dob") {
        validateField("dob");
    } else if (target.id === "agreement") {
        validateAgreement();
    }
});

form.addEventListener("reset", function() {
    window.setTimeout(function() {
        form.querySelectorAll(".error").forEach(function(element) {
            element.classList.remove("error");
        });
        form.querySelectorAll(".error-group").forEach(function(element) {
            element.classList.remove("error-group");
        });

        Object.values(errorMessages).forEach(function(element) {
            element.textContent = "";
        });

        successMessage.textContent = "";
        successMessage.hidden = true;

        passwordInput.setAttribute("type", "password");
        confirmPasswordInput.setAttribute("type", "password");
        togglePasswordButton.classList.remove("password-visible");
        togglePasswordButton.dataset.state = "hidden";
        togglePasswordButton.setAttribute("aria-pressed", "false");
        togglePasswordButton.textContent = "Show passwords";
        submitButton.textContent = "Submit Registration";
    }, 0);
});
