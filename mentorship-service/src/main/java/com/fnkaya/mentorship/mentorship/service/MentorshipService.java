package com.fnkaya.mentorship.mentorship.service;

import com.fnkaya.mentorship.mentorship.domain.Mentorship;
import com.fnkaya.mentorship.mentorship.domain.MentorshipStatus;
import com.fnkaya.mentorship.mentorship.domain.Phase;

import java.util.List;

public interface MentorshipService {

    Mentorship save(Mentorship mentorship);

    List<Mentorship> getByMenteeId(String menteeId);

    List<Mentorship> getByMentorAccountId(String accountId);

    Mentorship updateStatus(String id, MentorshipStatus mentorshipStatus);

    Mentorship getById(String id);

    Mentorship savePhase(String id, List<Phase> phaseList);

    Mentorship updatePhaseStatus(String id, Phase phase);

    Mentorship updatePhaseComment(String id, Phase phase);
}
