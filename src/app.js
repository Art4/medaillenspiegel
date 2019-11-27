import entryStorage from './storage.js';
import Vue from 'vue/dist/vue.js';

// app Vue instance
var app = new Vue({
    // app initial state
    data: {
        entries: entryStorage.fetch(),
        newEntry: '',
        editedEntry: null,
        mostGold: '0',
        mostSilver: '0',
        mostBronze: '0',
    },

    created: function () {
        this.updateMostProgress();
    },

    // watch entries change for localStorage persistence
    watch: {
        entries: {
            handler: function (entries) {
                entryStorage.save(entries);
            },
            deep: true
        }
    },

    // methods that implement data logic.
    // note there's no DOM manipulation here at all.
    methods: {
        addEntry: function () {
            var value = this.newEntry && this.newEntry.trim();
            if (!value) {
                return;
            }
            this.entries.push({
                id: entryStorage.uid++,
                title: value,
                gold: '0',
                silver: '0',
                bronze: '0',
                rank: '000000000',
            });
            this.newEntry = '';
        },

        removeEntry: function (entry) {
            this.entries.splice(this.entries.indexOf(entry), 1);
        },

        editEntry: function (entry) {
            this.beforeEditTitle = entry.title;
            this.beforeEditGold = entry.gold;
            this.beforeEditSilver = entry.silver;
            this.beforeEditBronze = entry.bronze;
            this.editedEntry = entry;
        },

        doneEdit: function (entry) {
            if (!this.editedEntry) {
                return;
            }
            this.editedEntry = null;
            entry.title = entry.title.trim();
            if (!entry.title) {
                this.removeEntry(entry);
            }
            if (! /^\d+$/.test(entry.gold)) {
                entry.gold = '0';
            }
            if (! /^\d+$/.test(entry.silver)) {
                entry.silver = '0';
            }
            if (! /^\d+$/.test(entry.bronze)) {
                entry.bronze = '0';
            }
            this.updateRank(entry);
            this.sortEntries();
            this.updateMostProgress();
        },

        cancelEdit: function (entry) {
            this.editedEntry = null;
            entry.title = this.beforeEditTitle;
            entry.gold = this.beforeEditGold;
            entry.silver = this.beforeEditSilver;
            entry.bronze = this.beforeEditBronze;
        },

        updateRank: function (entry) {
            entry.rank = entry.gold.padStart(3, '0')+
                         entry.silver.padStart(3, '0')+
                         entry.bronze.padStart(3, '0');
        },

        sortEntries: function () {
            this.entries.sort(function(el1, el2) {
                if (el1.rank < el2.rank) {
                    return 1;
                }

                if ( el1.rank > el2.rank) {
                    return -1;
                }

                return 0;
            });
        },

        updateMostProgress: function () {
            this.mostGold = Math.max.apply(Math, this.entries.map(function(o) { return o.gold; }));
            this.mostSilver = Math.max.apply(Math, this.entries.map(function(o) { return o.silver; }));
            this.mostBronze = Math.max.apply(Math, this.entries.map(function(o) { return o.bronze; }));
        },

        calcProgressGold: function (currentValue) {
            return new Number(currentValue/this.mostGold*33.333, 3).toFixed(2);
        },
        calcProgressSilver: function (currentValue) {
            return new Number(currentValue/this.mostSilver*33.333, 3).toFixed(2);
        },
        calcProgressBronze: function (currentValue) {
            return new Number(currentValue/this.mostBronze*33.333, 3).toFixed(2);
        },
    },
});

export default app;
