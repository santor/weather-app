import { useStore } from 'vuex';
import { computed, watch, onMounted } from 'vue';

export default function onCoordinatesChange(callbackFn) {
  const store = useStore();
  const coords = computed(() => store.state.location.coordinates);

  watch(coords, (currentCoordinates) => {
    callbackFn(currentCoordinates.latitude, currentCoordinates.longitude);
  });

  onMounted(() => {
    callbackFn(coords.value.latitude, coords.value.longitude);
  });
}
