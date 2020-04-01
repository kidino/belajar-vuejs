var app = new Vue({
    el: '#app',
    data: {
        users: []
    },
    created() {
        fetch('http://localhost/bvue/users.php')
            .then(response => response.json())
            .then(json => {
                this.users = json;
            })
    },
    methods: {
        isActive(user_index) {
            return (this.users[user_index].status == 'Active');
        }
    }
})