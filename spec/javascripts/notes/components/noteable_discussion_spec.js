import Vue from 'vue';
import createStore from '~/notes/stores';
import issueDiscussion from '~/notes/components/noteable_discussion.vue';
import '~/behaviors/markdown/render_gfm';
import { noteableDataMock, discussionMock, notesDataMock } from '../mock_data';

describe('issue_discussion component', () => {
  let store;
  let vm;

  beforeEach(() => {
    const Component = Vue.extend(issueDiscussion);

    store = createStore();
    store.dispatch('setNoteableData', noteableDataMock);
    store.dispatch('setNotesData', notesDataMock);

    vm = new Component({
      store,
      propsData: {
        note: discussionMock,
      },
    }).$mount();
  });

  afterEach(() => {
    vm.$destroy();
  });

  it('should render user avatar', () => {
    expect(vm.$el.querySelector('.user-avatar-link')).not.toBeNull();
  });

  it('should render discussion header', () => {
    expect(vm.$el.querySelector('.discussion-header')).not.toBeNull();
    expect(vm.$el.querySelector('.notes').children.length).toEqual(discussionMock.notes.length);
  });

  describe('actions', () => {
    it('should render reply button', () => {
      expect(vm.$el.querySelector('.js-vue-discussion-reply').textContent.trim()).toEqual(
        'Reply...',
      );
    });

    it('should toggle reply form', done => {
      vm.$el.querySelector('.js-vue-discussion-reply').click();
      Vue.nextTick(() => {
        expect(vm.$refs.noteForm).not.toBeNull();
        expect(vm.isReplying).toEqual(true);
        done();
      });
    });

    it('does not render jump to discussion button', () => {
      expect(
        vm.$el.querySelector('*[data-original-title="Jump to next unresolved discussion"]'),
      ).toBeNull();
    });
  });

  describe('computed', () => {
    describe('hasMultipleUnresolvedDiscussions', () => {
      it('is false if there are no unresolved discussions', done => {
        spyOnProperty(vm, 'unresolvedDiscussions').and.returnValue([]);

        Vue.nextTick()
          .then(() => {
            expect(vm.hasMultipleUnresolvedDiscussions).toBe(false);
          })
          .then(done)
          .catch(done.fail);
      });

      it('is false if there is one unresolved discussion', done => {
        spyOnProperty(vm, 'unresolvedDiscussions').and.returnValue([discussionMock]);

        Vue.nextTick()
          .then(() => {
            expect(vm.hasMultipleUnresolvedDiscussions).toBe(false);
          })
          .then(done)
          .catch(done.fail);
      });

      it('is true if there are two unresolved discussions', done => {
        spyOnProperty(vm, 'unresolvedDiscussions').and.returnValue([{}, {}]);

        Vue.nextTick()
          .then(() => {
            expect(vm.hasMultipleUnresolvedDiscussions).toBe(true);
          })
          .then(done)
          .catch(done.fail);
      });
    });
  });
});
