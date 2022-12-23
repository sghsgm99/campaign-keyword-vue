import { DateTime, Settings } from 'luxon'
import Vue from 'vue'

Vue.filter('formatDate', function (value) {
  if (value) {
    return DateTime.fromISO(value).toFormat('cccc, LLLL d yyyy, h:mm a')
  }
})

Vue.filter('formatDate1', function (value) {
  if (value) {
    return DateTime.fromISO(value).toFormat('LLLL d yyyy, h:mm a')
  }
})

export default {
  methods: {
    scrollToTop() {
      window.scrollTo(0, 0)
    },

    abbrNum(number, decPlaces) {
      decPlaces = Math.pow(10, decPlaces)

      // Enumerate number abbreviations
      var abbrev = ['K', 'M', 'B', 'T']

      for (var i = abbrev.length - 1; i >= 0; i--) {
        var size = Math.pow(10, (i + 1) * 3)

        if (size <= number) {
          number = Math.round((number * decPlaces) / size) / decPlaces
          if (number == 1000 && i < abbrev.length - 1) {
            number = 1
            i++
          }
          number += abbrev[i]
          break
        }
      }

      return number
    },

    scrollToElement(className) {
      const el = this.$el.getElementsByClassName(className)[0]

      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    },

    getRange(range) {
      let dates = []
      if (range === 'week' || range === null) {
        let enddate = DateTime.now().toFormat('yyyy-MM-dd')
        let startdate = DateTime.local()
          .minus({ days: 7 })
          .toFormat('yyyy-MM-dd')

        dates['startdate'] = startdate
        dates['enddate'] = enddate
        return dates
      } else if (range === 'month') {
        let enddate = DateTime.now().toFormat('yyyy-MM-dd')
        let startdate = DateTime.local()
          .minus({ months: 1 })
          .toFormat('yyyy-MM-dd')

        dates['startdate'] = startdate
        dates['enddate'] = enddate
        return dates
      } else if (range === 'year') {
        let enddate = DateTime.now().toFormat('yyyy-MM-dd')
        let startdate = DateTime.local()
          .minus({ years: 1 })
          .toFormat('yyyy-MM-dd')

        dates['startdate'] = startdate
        dates['enddate'] = enddate
        return dates
      }
    },

    luxonDateFormat(date) {
      return DateTime.fromISO(date)
        .setZone(this.setTimezone())
        .toFormat('yyyy-LL-dd')
    },

    luxonDateFormatEx(date, formatStr) {
      return DateTime.fromISO(date)
        .setZone(this.setTimezone())
        .toFormat(formatStr)
    },

    luxonDateTimeFormat(date) {
      return DateTime.fromISO(date)
        .setZone(this.setTimezone())
        .toFormat('yyyy-LL-dd hh:mm')
    },

    luxonDateFormatHuman(date) {
      return DateTime.fromISO(date).setZone(this.setTimezone()).toFormat('FF')
    },

    setTimezone() {
      return 'America/Los_Angeles'
    }
  }
}
