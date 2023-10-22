package neutraldata.project.user;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

	private UserRepository userRepository;

	@Autowired
	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}
	
	@Transactional
	public User saveUser(User user) throws DataAccessException {
		user.setCreationDate(LocalDateTime.now());
		user.setEnable(true);
		return userRepository.save(user);
	}
	
	public User findUserById(Long id) {
		return userRepository.findById(id).orElseThrow(()->new UserNotFoundException("User by id"+ id+"was not found"));
	}
	
	public List<User> findAll() {
		return userRepository.findAll();
	}
	
	public void deleteUserById(Long id) {
		userRepository.deleteById(id);
	}
	
	public void deleteAll() {
		userRepository.deleteAll();
	}
	
}
