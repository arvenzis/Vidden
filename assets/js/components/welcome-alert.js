var WelcomeAlertComponent = Vue.extend({
    data: function() {
        return {
            greeting: this.getGreeting()
        }
    },

    methods: {
        closeWelcomeAlert: function (event) {
            this.$refs["welcomeAlert"].remove();
        },
        getGreeting: function () {
            var i = 0;
            var hour = new Date().getHours();
            var dayParts = [6,12,18,24]; //Keep in this order
            var greetings = [ //Keep in this order
                'Goedenacht',
                'Goedemorgen',
                'Goedemiddag',
                'Goedenavond'
            ];

            var greet = function() {
                if( hour < dayParts[i] ) {
                    return greetings[i];
                }
                else{
                    i++;
                    return greet();
                }
            };
            return greet();
        }
    },

    template: '<div class="alert alert-info" role="alert" ref="welcomeAlert">\n' +
        '               {{ greeting }} Arjen\n' +
        '                <button type="button" class="close" data-dismiss="alert" aria-label="Close" v-on:click="closeWelcomeAlert()">\n' +
        '                    <span aria-hidden="true">&times;</span>\n' +
        '                </button>\n' +
        '            </div>'
});