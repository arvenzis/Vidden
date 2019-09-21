var LoginComponent = Vue.extend({
    template: '<div class="container" style="margin-top: 80px">\n' +
        '            <div class="row justify-content-center">\n' +
        '                <div class="col-md-7">\n' +
        '                    <div class="card">\n' +
        '                        <div class="card-header">Inloggen</div>\n' +
        '\n' +
        '                        <div class="card-body">\n' +
        '                            <form method="POST">\n' +
        '\n' +
        '                                <div class="form-group row">\n' +
        '                                    <label for="email" class="col-md-4 col-form-label text-md-right">Gebruikernaam</label>\n' +
        '\n' +
        '                                    <div class="col-md-6">\n' +
        '                                        <input id="email" type="email" class="form-control" name="email" required autocomplete="email" autofocus>\n' +
        '                                    </div>\n' +
        '                                </div>\n' +
        '\n' +
        '                                <div class="form-group row">\n' +
        '                                    <label for="password" class="col-md-4 col-form-label text-md-right">Wachtwoord</label>\n' +
        '\n' +
        '                                    <div class="col-md-6">\n' +
        '                                        <input id="password" type="password" class="form-control" name="password" required autocomplete="current-password">\n' +
        '                                    </div>\n' +
        '                                </div>\n' +
        '\n' +
        '                                <div class="form-group row">\n' +
        '                                    <div class="col-md-6 offset-md-4">\n' +
        '                                        <a href="#">\n' +
        '                                            Wachtwoord vergeten?\n' +
        '                                        </a>\n' +
        '                                    </div>\n' +
        '                                </div>\n' +
        '\n' +
        '                                <div class="form-group row mb-0">\n' +
        '                                    <div class="col-md-8 offset-md-4">\n' +
        '                                        <button type="submit" class="btn btn-primary btn-windesheim">\n' +
        '                                            Inloggen\n' +
        '                                        </button>\n' +
        '                                    </div>\n' +
        '                                </div>\n' +
        '                            </form>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '        </div>'
});